-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: localhost    Database: assaka_blog
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` (`id`, `title`, `slug`, `content`, `status`, `created_at`, `updated_at`) VALUES (1,'关于我','about','# 关于我\n\n你好！欢迎来到我的博客。我是 **Assaka**，一名热爱技术的开发者。\n\n## 🛠 技术栈\n\n- 后端：NestJS, TypeORM, MySQL\n- 前端：Vue 3, TypeScript, Tailwind CSS\n- 工具：Git, Docker, VS Code\n\n## 💻 代码片段\n\n```javascript\nconst hello = (name) => {\n  console.log(`Hello, ${name}!`);\n};\nhello(\'World\');\n```\n\n## 📬 联系我\n\n- 邮箱：admin@example.com\n- GitHub：[点击访问我的主页](https://github.com)\n\n> 感谢你的访问，希望我的文章对你有帮助！',1,'2026-10-20 16:52:30.000000','2026-10-20 16:52:30.000000');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `post_tags`
--

LOCK TABLES `post_tags` WRITE;
/*!40000 ALTER TABLE `post_tags` DISABLE KEYS */;
INSERT INTO `post_tags` (`post_id`, `tag_id`) VALUES (1,7),(2,3),(2,7),(2,8),(3,2),(3,7),(4,6),(4,8),(5,4),(6,1),(6,7),(7,5),(7,8);
/*!40000 ALTER TABLE `post_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` (`id`, `title`, `slug`, `summary`, `content`, `status`, `view_count`, `published_at`, `created_at`, `updated_at`) VALUES (1,'Hello World','hello-world','这是我的第一篇文章','## 前言\n\n这是一段普通段落，用来验证正文排版。行内代码长这样：`const a = 1`，还有 `npm run dev`。\n这里有一个链接：[Vue 官网](https://vuejs.org) ，以及一个裸链接 https://vitejs.dev 会被自动识别。\n\n单行换行也会生效，\n因为开了 `breaks` 选项。\n\n## 代码高亮\n\n### JavaScript\n\n```js\nfunction greet(name) {\n  // 打印问候语\n  const msg = `Hello, ${name}!`\n  console.log(msg)\n  return msg\n}\n```\n\n### TypeScript\n\n```ts\ninterface Post {\n  id: number\n  title: string\n  tags: string[]\n}\n\nconst post: Post = { id: 1, title: \'你好\', tags: [\'vue\', \'ts\'] }\n```\n\n### Java\n\n```java\npublic class Demo {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, AssakaBlog\");\n  }\n}\n```\n\n### Shell 与配置\n\n```bash\nnpm install\nnpm run dev\n```\n\n```yaml\nserver:\n  port: 3000\n  host: localhost\n```\n\n```json\n{ \"code\": 200, \"msg\": \"success\", \"data\": [] }\n```\n\n### 无语言标记的代码块\n\n````\n没有标注语言时，只保留背景，不做着色。\n````\n\n## 表格\n\n| 方法 | 路径 | 说明 |\n| --- | --- | --- |\n| GET | /posts/getSum | 文章总数 |\n| GET | /posts/archive | 归档列表 |\n| GET | /posts/:slug | 文章详情 |\n\n## 列表\n\n有序列表：\n\n1. 第一步：安装依赖\n2. 第二步：配置数据库\n3. 第三步：启动服务\n\n无序列表：\n\n- 支持 **加粗**\n- 支持 *斜体*\n- 支持 ~~删除线~~\n\n## 引用与图片\n\n> 这是一段引用。截图示例：\n> ![示例图片](https://picsum.photos/600/300)\n\n## 结语\n\n以上内容用于验证 markdown-it + highlight.js 的渲染效果。\n````\n\n## 它能验证什么\n\n| 段落 | 验证点 |\n|---|---|\n| `## 前言`、`### JavaScript` | 目录只收录 h2/h3，h3 缩进更深 |\n| 行内代码 | 浅底小方块（`:not(pre) > code`） |\n| 各语言代码块 | 按需注册的 js/ts/java/bash/yaml/json 是否高亮 |\n| 无语言代码块 | 走 `escapeHtml` 分支，仍有背景无着色 |\n| 表格 | markdown-it 默认 GFM 表格 |\n| 裸链接 | `linkify: true` 自动转 `<a>` |\n| 图片 | `:deep(img) max-width:100%` 不溢出 |\n| `~~删除线~~` | 默认支持 |\n\n## 放进数据库的注意事项\n\n**最大的坑是转义。** 上面内容里有大量**单引号**（如 `\'vue\'`、`\"success\"` 用的是双引号没事，但 `\'Hello, ${name}!\'` 有单引号）和**换行**。若直接拼进 SQL：\n\n```sql\nINSERT INTO posts (title, slug, summary, content, status, published_at)\nVALUES (\'测试文章\', \'markdown-demo\', \'渲染示例\', \'<这里塞上面内容>\', 1, NOW());\n```\n\n内容里的每个 `\'` 都必须写成 `\'\'`（或 `\\\'`），否则 SQL 语法错误。手工做这件事极易出错。\n\n**三个更省事的办法：**\n\n1. **用数据库 GUI 工具**（Navicat / DBeaver / MySQL Workbench）直接粘贴进单元格——**推荐**，工具会自动转义，无需操心；\n2. **写进 `.sql` 文件再用 `SOURCE` 导入**，同样要手动转义单引号；\n3. **开发一个后台录入接口**（你项目迟早要做），用参数化查询，从根上避免转义问题。\n\n> 顺便：`slug` 有唯一索引 `uk_slug`，示例里我用的是 `markdown-demo`，如果和已有数据重名会插入失败。`published_at` 记得给值（如 `NOW()`），否则会因 `status=1` + 排序逻辑出现意外分组。\n\n## 验证路径\n\n1. 插入后确认 `status = 1`；\n2. 浏览器访问 `http://localhost:5173/posts/markdown-demo` ；\n3. 重点看三处：**右侧目录**（应有\"前言/代码高亮/表格…\"）、**代码是否彩色**、**切换主题后代码配色是否跟随变化**。\n\n需要我把这段内容**转义好、直接生成一条可执行的 `INSERT` 语句**吗？那样你复制进 MySQL 就能跑（不过内容较长，语句会比较大）。',1,0,'2026-09-25 22:17:01','2026-09-25 22:17:01.482392','2026-10-12 17:39:33.536096'),(2,'Vue 3 组合式 API 实践','vue3-composition-api-2026','探索 Vue 3 组合式 API 的最佳实践。','\n## 表格\n\n| 方法 | 路径 | 说明 |\n| --- | --- | --- |\n| GET | /posts/getSum | 文章总数 |\n| GET | /posts/archive | 归档列表 |\n| GET | /posts/:slug | 文章详情 |\n',1,120,'2026-01-15 10:30:00','2026-09-28 18:32:58.250427','2026-10-12 17:47:43.426492'),(3,'TypeScript 高级类型技巧','typescript-advanced-types-2026','掌握 TypeScript 高级类型，提升代码质量。','# TypeScript 高级类型技巧\n\n正文内容...',1,85,'2026-05-22 14:45:00','2026-09-28 18:32:58.250427','2026-09-28 18:32:58.250427'),(4,'NestJS 微服务入门','nestjs-microservices-2025','从零开始搭建 NestJS 微服务。','# NestJS 微服务入门\n\n正文内容...',1,200,'2025-03-10 09:00:00','2026-09-28 18:32:58.250427','2026-09-28 18:32:58.250427'),(5,'MySQL 索引优化指南','mysql-index-optimization-2025','深入理解 MySQL 索引原理与优化。','# MySQL 索引优化指南\n\n正文内容...',1,310,'2025-08-18 16:20:00','2026-09-28 18:32:58.250427','2026-09-28 18:32:58.250427'),(6,'React 18 新特性解析','react18-features-2024','解析 React 18 的并发特性与自动批处理。','# React 18 新特性解析\n\n正文内容...',1,450,'2024-02-14 11:11:00','2026-09-28 18:32:58.250427','2026-09-28 18:32:58.250427'),(7,'Docker 容器化部署实战','docker-deployment-2024','使用 Docker 部署前后端应用。','# Docker 容器化部署实战\n\n正文内容...',1,520,'2024-11-30 20:00:00','2026-09-28 18:32:58.250427','2026-09-28 18:32:58.250427');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` (`id`, `name`, `slug`, `created_at`) VALUES (1,'React','react','2026-10-14 22:25:14.000000'),(2,'Vue','vue','2026-10-14 22:25:14.000000'),(3,'TypeScript','typescript','2026-10-14 22:25:14.000000'),(4,'Docker','docker','2026-10-14 22:25:14.000000'),(5,'NestJS','nestjs','2026-10-14 22:25:14.000000'),(6,'MySQL','mysql','2026-10-14 22:25:14.000000'),(7,'前端','frontend','2026-10-14 22:25:14.000000'),(8,'后端','backend','2026-10-14 22:25:14.000000');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-20 22:34:21
