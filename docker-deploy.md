## 先理清思路：为什么要拆成三个文件

一个 Dockerfile 只能描述**一个镜像**怎么构建。而一个完整的前后端分离应用，至少要跑三个容器：数据库、后端服务、前端静态站点。它们还需要互相发现、按依赖顺序启动、数据持久化——这些都不是单个 Dockerfile 能表达的。

所以职责这样划分：

| 文件 | 职责 |
| --- | --- |
| `blog_backend/Dockerfile` | 把 NestJS 源码编译成可运行的 Node 镜像 |
| `blog_frontend/Dockerfile` | 把 Vue 源码打包成静态文件，塞进 Nginx |
| `docker-compose.yml` | 声明三个容器如何启动、连接、挂载数据 |

构建完成后，一条 `docker compose up -d` 就能拉起整套服务。

## 整体架构

```text
浏览器
  │  http://localhost:8080
  ▼
[frontend 容器]  nginx:80
  ├── /            → SPA 静态文件
  └── /api/*       → 反向代理 ──┐
                                ▼
                        [backend 容器] NestJS:3000
                                │
                                ▼
                        [mysql 容器] MySQL:3306
                                │
                                ▼
                        mysql_data 卷（数据落盘）
```

关键点在于：前端**不直接请求 `http://localhost:3000`**。那样只在本机能通，部署到服务器后，用户的浏览器会去请求他自己的 localhost，必然失败。正确做法是让浏览器只访问前端域名，由 Nginx 把 `/api` 同源代理到后端——顺带也彻底绕开了 CORS。

## 一、后端 Dockerfile：多阶段构建

```dockerfile
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

这不是"一个容器装所有东西"，而是三个独立的构建阶段。每个 `FROM` 都会产生一个临时镜像，只有最后一个阶段会成为最终运行的镜像，前两个在构建完成后被丢弃。

```text
[deps 阶段]     只装依赖，产出 node_modules
      ↓
[build 阶段]    依赖 + 源码 → 编译出 dist
      ↓
[runtime 阶段]  只带 dist + 生产依赖 → 最终镜像
```

好处是编译工具链（TypeScript、Nest CLI）不会进入最终镜像。如果单阶段一把梭，镜像体积会从一百多 MB 膨胀到八百 MB 以上。

### 阶段一：deps，只装依赖

`FROM node:24-alpine AS deps` 使用 Node 24 的 Alpine 版本，并用 `AS deps` 给阶段命名，供后续 `--from=deps` 引用。Alpine 是精简版 Linux，基础镜像只有约 50MB，而普通 `node:24` 接近 1GB。

`WORKDIR /app` 设置后续命令的工作目录，等价于 `mkdir -p /app && cd /app`。

`COPY package*.json ./` 只复制 `package.json` 和 `package-lock.json`。**为什么先单独复制这两个文件**，这是 Docker 的分层缓存技巧。每条指令是一层，只要该层内容没变就能复用缓存。依赖很少变动、源码经常变动，所以把"装依赖"放在"复制源码"之前：改代码时无需重新执行 `npm ci`，构建时间从几分钟降到几秒。

`RUN npm ci` 按 lock 文件精确安装依赖。它和 `npm install` 的区别是：严格锁定版本、要求 lock 文件必须存在、会先删掉 `node_modules` 再全量安装，结果完全可复现，适合 CI/CD。

### 阶段二：build，编译 TypeScript

`FROM node:24-alpine AS build` 是一个**全新阶段**，不继承 `deps`。多阶段之间不共享文件系统，必须手动拷贝。

`COPY --from=deps /app/node_modules ./node_modules` 从 deps 阶段的文件系统里把依赖拷过来，语法是 `--from=<阶段名> <源路径> <目标路径>`。

`COPY . .` 把构建上下文中未被 `.dockerignore` 排除的文件复制进 `/app`。`.dockerignore` 排除了 `node_modules` 和 `dist`，这一点是必须的：

- 本地 Windows 的 `node_modules` 不能覆盖刚拷进来的 Linux 版，原生模块跨平台不兼容；
- 本地的旧 `dist` 不能混进来，避免产物不一致。

`RUN npm run build` 执行 `nest build`，把 `src/` 下的 `.ts` 编译成 JS 输出到 `dist`。编译失败，构建就停在这里。

### 阶段三：runtime，最终镜像

`ENV NODE_ENV=production` 会影响 Nest 的日志详尽程度、部分库的优化路径，不能省。

`COPY package*.json ./` 加 `RUN npm ci --omit=dev` 重新安装一遍依赖，但排除 `devDependencies`，也就是 TypeScript、Nest CLI、ESLint、Jest 这些只在开发期需要的东西。这里没有直接从 deps 阶段拷 `node_modules`，因为 deps 装的是全量依赖，直接拷会让镜像带上几百 MB 无用包。重新装一次虽然多花时间，但换来干净的镜像。后面的 `npm cache clean --force` 用于清理 npm 缓存，进一步减小体积。

`COPY --from=build /app/dist ./dist` 只从构建阶段取编译产物，源码 `src/` 完全不进最终镜像。

`EXPOSE 3000` 是文档性声明，并不会真的开放端口。真正的端口映射写在 compose 文件里。

`CMD ["node", "dist/main.js"]` 使用 exec 形式（JSON 数组）而非 shell 形式。好处是 Node 进程会成为 PID 1，能正确接收 `SIGTERM`，`docker compose stop` 时可以优雅关闭，而不是等十秒后被强杀。

### 最终镜像里有什么

```text
/app
├── dist/              ← 编译产物（JS）
├── node_modules/      ← 仅生产依赖
└── package.json
```

没有 `src/`、`tsconfig.json`、`nest-cli.json`、`.ts` 文件、TypeScript、ESLint、测试框架。

## 二、前端 Dockerfile：从 Node 到 Nginx

```dockerfile
FROM node:24-alpine AS build
WORKDIR /app
ARG VITE_API_BASE=/api
ENV VITE_API_BASE=$VITE_API_BASE
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

这里只有两个阶段，比后端少一个，原因是：后端运行时需要 Node 进程，所以必须保留 `node_modules`；前端运行时不需要 Node，浏览器只拿静态文件，`dist` 被 Nginx 直接吐出去即可。依赖装完、编译完就再也用不到，自然可以跟着构建阶段一起丢弃。

### 阶段一：build，编译出静态文件

`FROM node:24-alpine AS build` 起名为 build，供第二阶段引用。

`ARG VITE_API_BASE=/api` 声明一个构建期参数，默认值是 `/api`。`ARG` 只在构建时存在，构建完成后就消失，不会留在镜像里；它的值可以被覆盖，compose 里就是用 `args` 传入的。

`ENV VITE_API_BASE=$VITE_API_BASE` 把 ARG 转成环境变量。这一步看似冗余，但不能省——`ARG` 的值只在 Dockerfile 指令中可用，`RUN` 执行的进程读不到；只有 `ENV` 才会变成容器内的环境变量，从而被 `npm run build` 里的 Vite 进程读到。

Vite 的规则是只有 `VITE_` 前缀的环境变量会被暴露给 `import.meta.env`。所以代码里这一行：

```ts
baseURL: import.meta.env.VITE_API_BASE ?? "http://localhost:3000"
```

在构建时会被**字面替换**成：

```ts
baseURL: "/api"
```

这是整个部署方案的关键。打包后的 JS 里写死的是 `/api`，浏览器请求 `http://localhost:8080/api/...`，Nginx 再转发给后端。如果没有这个变量，就会 fallback 到 `localhost:3000`，线上必然失败。

`COPY package*.json ./` 加 `RUN npm ci` 同样利用分层缓存。注意这里是**完整安装**（含 `devDependencies`），因为 `vite`、`vue-tsc` 都在开发依赖里。这和后端 runtime 阶段刻意排除 devDeps 形成对比——前端编译必须有它们。

`COPY . .` 复制整个前端目录，包含 `nginx.conf`。所以第二阶段能直接 `COPY nginx.conf`，它是从构建上下文拿的，不是从 build 阶段拿的。

`RUN npm run build` 执行的项目脚本通常是：

```json
"build": "run-p type-check \"build-only {@}\" --"
```

`run-p` 会并行跑两个任务：

| 子任务 | 实际命令 | 作用 |
| --- | --- | --- |
| `type-check` | `vue-tsc --build` | TypeScript 类型检查 |
| `build-only` | `vite build` | 打包出 dist |

任何类型错误都会让 `vue-tsc` 返回非零退出码，导致 `npm run build` 失败，进而中断 Docker 构建。这是"本地 `npm run dev` 能跑、Docker 构建却失败"的头号原因——dev 模式不做类型检查。

### 阶段二：nginx，最终镜像

`FROM nginx:1.27-alpine` 完全换掉基础镜像，这里没有 Node 了。版本号显式锁定，避免 `nginx:alpine` 随官方更新漂移。

`COPY nginx.conf /etc/nginx/conf.d/default.conf` 用同名文件覆盖镜像自带的默认站点配置。如果不覆盖，Nginx 只会返回自带的欢迎页，既不会指向 dist，也不会代理 `/api`。

`COPY --from=build /app/dist /usr/share/nginx/html` 把上一阶段的产物搬到 Nginx 的默认站点根目录。

`EXPOSE 80` 是声明，实际对外映射写在 compose 里，比如 `8080:80`。

`CMD ["nginx", "-g", "daemon off;"]` 启动 Nginx 并强制它前台运行。`daemon off;` 是必须的：Nginx 默认会 fork 到后台，主进程随即退出，而 Docker 的规则是主进程退出即容器停止。不加这句，容器会启动后立刻变成 Exited，这是 Nginx 容器最常见的错误。

### 最终镜像里有什么

```text
/
├── usr/share/nginx/html/           ← dist
│   ├── index.html
│   └── assets/*.js|css
├── etc/nginx/conf.d/default.conf   ← 配置
└── usr/sbin/nginx
```

没有 Node、`node_modules`、`src/`、`vite`、`package.json`，镜像大约 50MB。

### 环境变量是编译期的，不是运行期的

```text
构建时   import.meta.env.VITE_API_BASE  →  "/api"（变成字面量）
运行时   容器里改环境变量               →  完全无效
```

想换 API 地址，必须重新构建镜像。`docker compose restart frontend` 没用，那只是重启旧镜像。

## 三、docker-compose.yml：把三个容器编排起来

单个 Dockerfile 只能描述一个镜像怎么构建。而完整应用有三个容器，还需要互相能找到、按顺序启动、数据不丢。compose 文件就是干这件事的：用一份 YAML 声明整个应用拓扑。

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: assaka-mysql
    restart: unless-stopped
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root123456}
      MYSQL_DATABASE: ${DB_NAME:-assaka_blog}
      MYSQL_USER: ${DB_USER:-assaka}
      MYSQL_PASSWORD: ${DB_PASSWORD:-assaka123456}
      TZ: Asia/Shanghai
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./assaka_blog.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h 127.0.0.1 -u root -p$$MYSQL_ROOT_PASSWORD --silent"]
      interval: 5s
      timeout: 5s
      retries: 20
      start_period: 30s

  backend:
    build: ./blog_backend
    container_name: assaka-backend
    restart: unless-stopped
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: ${DB_USER:-assaka}
      DB_PASSWORD: ${DB_PASSWORD:-assaka123456}
      DB_NAME: ${DB_NAME:-assaka_blog}
      PORT: 3000
      TZ: Asia/Shanghai
    depends_on:
      mysql:
        condition: service_healthy
    ports:
      - "3000:3000"

  frontend:
    build:
      context: ./blog_frontend
      args:
        VITE_API_BASE: /api
    container_name: assaka-frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "8080:80"

volumes:
  mysql_data:
```

顶层只有 `services` 和 `volumes` 两段。`services` 下每个键是**服务名**，这个名字同时充当容器 DNS 名和 compose 命令的操作目标。

### mysql 服务

`image: mysql:8.0` 表示直接使用官方镜像，不从本地 Dockerfile 构建。`container_name` 固定容器名，方便 `docker exec -it` 直接操作。如果不写，Compose 会自动命名成 `<项目名>-mysql-1`。

`restart: unless-stopped` 让容器异常退出时自动重启，但手动 `docker stop` 的不会被拉起。没有这条，Docker Desktop 重启后所有容器都是停止状态。

`command` 下的两项是追加给 `mysqld` 的启动参数，覆盖镜像默认值。显式指定字符集可以保证与建表语句里的 `utf8mb4_unicode_ci` 完全一致。字符集不一致会导致中文乱码、排序异常，这类问题排查起来非常痛苦。

`environment` 里的 `${VAR:-默认值}` 是 Compose 的变量替换语法：优先取 shell 环境变量或项目根目录 `.env` 文件里的值，取不到才用默认值。前四个是 MySQL 镜像约定的初始化变量，只在首次启动、数据目录为空时生效：

| 变量 | 作用 |
| --- | --- |
| `MYSQL_ROOT_PASSWORD` | 必填，root 密码 |
| `MYSQL_DATABASE` | 自动创建这个库 |
| `MYSQL_USER` / `MYSQL_PASSWORD` | 自动创建该用户并授予该库的全部权限 |

`TZ: Asia/Shanghai` 容易被忽略但很重要。应用侧如果用 `getFullYear()` 按年分组，容器默认 UTC 会在跨年边界把文章分到错误的年份；`CURRENT_TIMESTAMP` 也会按 UTC 写入。另外要注意，根目录的 `.env` 只被 Compose 用来做变量替换，容器内部读不到它，后端配置来自 `backend` 服务的 `environment`。

`ports: "3307:3306"` 的格式是宿主机端口:容器端口。容器内仍是标准 3306，所以后端配 `DB_PORT: 3306`；宿主机改用 3307，是为了避开本机可能已占用的 3306。这行只影响从宿主机访问容器，容器之间走内部网络，不经过映射。

`volumes` 有两种类型，作用截然不同：

- `mysql_data:/var/lib/mysql` 是**命名卷**，由 Docker 管理。删容器、重建镜像数据都还在，也不受 Windows 文件系统权限和性能影响。
- `./assaka_blog.sql:/docker-entrypoint-initdb.d/01-init.sql:ro` 是**绑定挂载**，把宿主机 SQL 文件挂进初始化目录，`:ro` 表示只读。

关于初始化脚本有个关键机制：`/docker-entrypoint-initdb.d/` 下的 `.sql` 文件只在**数据目录为空时**（首次启动）执行一次，之后重启多少次都不会再跑。还有一个经典陷阱——如果宿主机上这个 SQL 文件不存在，Docker 会自动创建一个**同名目录**，容器里挂载的就不是文件而是空目录，初始化静默失败且没有任何报错。

`healthcheck` 定义"容器是否真正就绪"，而不只是"进程是否活着"。`test` 用 `mysqladmin ping` 探测，`interval` 是检查间隔，`timeout` 是单次超时，`retries` 是连续失败多少次判为不健康，`start_period` 给初始化留出宽限期（这段时间内的失败不计入重试）。

那个 `$$` 是转义。Compose 会先做一遍变量替换，写单个 `$` 时它会在宿主机上求值；`$$` 表示"输出一个真正的 `$`"，让 `$MYSQL_ROOT_PASSWORD` 交给容器内的 shell 展开，正好取到上面 `environment` 里的密码。

探测地址用 `-h 127.0.0.1` 而不是 `localhost`，是因为后者走 Unix socket，前者走 TCP。用 TCP 才能验证网络层面可连接，也正是后端连接时用的方式。

健康检查不能省。MySQL 启动时进程先起来，然后要花十几到几十秒做初始化。没有健康检查，后端会在 MySQL 还没准备好时就开始连接，然后疯狂重试。健康检查配合 `condition: service_healthy` 从根上避免了这个竞态。

### backend 服务

`build: ./blog_backend` 是简写形式，等价于指定 context 为 `./blog_backend`、Dockerfile 为 `Dockerfile`。

`environment` 里的变量与后端代码逐条对应：数据库相关五个变量喂给 TypeORM，`PORT` 决定监听端口。

`DB_HOST: mysql` 是最关键的一行，它必须是**服务名**。因为容器内的 `localhost` 指的是容器自己，不是宿主机，更不是 MySQL 容器。Compose 会创建一张内部网络，把所有服务接进去并内置 DNS，所以 `mysql` 这个名字能解析成对应容器的 IP。

`depends_on` 用的是长语法 `condition: service_healthy`：等 mysql 的健康检查变绿，才启动 backend。这比默认的短语法（只保证先创建 mysql 容器）强得多。

`ports: "3000:3000"` 把后端直接暴露到宿主机。严格说不是必需的，因为 Nginx 走内部网络就能访问。保留它是为了调试方便：可以直接 `curl localhost:3000/...` 绕过 Nginx，快速区分是后端问题还是代理问题。上线时可以删掉这行，减少暴露面。

### frontend 服务

`build.args.VITE_API_BASE` 对应 Dockerfile 里的 `ARG`。注意它是构建参数，不是运行时环境变量——Vite 在 `npm run build` 时就把 `/api` 烧进了 JS，运行时再传已经来不及了。写成 `environment` 是完全无效的，这是很常见的误解。

这里的 `depends_on` 用短语法，只保证启动顺序，不等待后端真正就绪。这是合理的：Nginx 启动时并不需要后端在线，它只是把代理地址记在配置里，等真的有请求进来才去连接。

### 隐式的网络

文件里没有写任何网络配置，但 Compose 会自动创建一个默认 bridge 网络，并把三个服务都接进去。这张网络提供两件事：服务名 DNS（`mysql`、`backend`、`frontend` 互相可解析）和隔离（外部容器无法直接访问，除非通过 ports 映射）。

所以整条请求链路是：

```text
浏览器
  │  localhost:8080（宿主机端口）
  ▼
frontend 容器 :80 (nginx)
  │  /api/... → proxy_pass http://backend:3000/（走内部 DNS）
  ▼
backend 容器 :3000 (Nest)
  │  DB_HOST=mysql:3306（走内部 DNS）
  ▼
mysql 容器 :3306
  │
  ▼
mysql_data 卷
```

## 前后端 Dockerfile 对照

| 维度 | backend | frontend |
| --- | --- | --- |
| 阶段数 | 3（deps / build / runtime） | 2（build / nginx） |
| 基础镜像 | `node:24-alpine` | 构建用 node，运行用 nginx |
| 运行时需要 Node | 需要 | 不需要 |
| 最终镜像内容 | dist + 生产 node_modules | dist + nginx 配置 |
| 启动命令 | `node dist/main.js` | `nginx -g "daemon off;"` |
| 构建期变量 | 无 | `VITE_API_BASE` |
| 镜像体积 | 较大 | 约 50MB |

## 五个容易踩的坑

**1. 健康检查缺失导致后端连不上库**

数据库容器"启动了"不等于"可连接了"。必须用 healthcheck 加 `condition: service_healthy`，否则后端会在初始化完成前开始连接并反复重试。

**2. 数据库地址写成 localhost**

容器内的 localhost 指向容器自己。跨容器通信必须用服务名，并且依赖 Compose 的默认网络 DNS。

**3. 前端环境变量写成运行时变量**

Vite 的 `import.meta.env` 是编译期替换。写成 `environment` 而不是 `build.args`，值根本不会进入产物，前端仍会请求 fallback 地址。

**4. Nginx 缺少 SPA 回退**

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

没有这行，用户在 `/posts/hello-world` 刷新页面时，Nginx 找不到对应的物理文件，直接返回 404。这是前端部署最经典的问题。

**5. 初始化 SQL 只执行一次**

数据卷为空时才会跑初始化脚本。改了 SQL 想重跑，只能删除数据卷（会清空数据），或者手动用 `docker exec` 导入。

## 常用命令

```bash
docker compose up -d --build            # 构建并后台启动
docker compose ps                       # 查看状态，关注 healthy
docker compose logs -f backend          # 跟踪某个服务日志
docker compose restart backend          # 重启，不重建（代码改动不生效）
docker compose up -d --build backend    # 重建（代码改动后用这个）
docker compose down                     # 停止并删除容器，保留数据卷
docker compose down -v                  # 危险：连数据卷一起删，数据库清空
```

## 小结

这套配置的核心思想只有三点：

1. **构建与运行分离**——用多阶段构建把编译工具链挡在最终镜像之外，镜像更小、更安全；
2. **同源代理**——前端只请求自己的域名，由 Nginx 转发 `/api`，避免跨域和地址硬编码；
3. **健康检查驱动启动顺序**——不靠 sleep 猜时间，而是等依赖真正就绪，从根上消除启动竞态。
