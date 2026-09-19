<template>
  <header class="navbar">

    <div class="logo-section">
      <img src="../assets/avatar.jpg" alt="Avatar" class="avatar">
      <span class="site-title">Assakaのblog</span>
    </div>

    <nav class="nav-links">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{'is-active': route.path === item.path}"
        >
          {{ item.name }}
      </router-link>
    </nav>

    <button class="hamburger" @click="$emit('toggle-sidebar')">
      <span></span><span></span><span></span>
    </button>

  </header>
</template>

<script setup lang="ts">
  import {useRoute} from 'vue-router'
  // 定义 emit，向父组件抛事件
  defineEmits<{ (e: 'toggle-sidebar'): void}> ()

  interface NavItem {
    name: string
    path: string
  }
  const navItems: NavItem[] = [
    {name: '主页', path: '/'},
    {name: '关于', path: '/about'}
  ]
  const route = useRoute()

</script>


<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;

  /* 毛玻璃核心：半透明背景 + 模糊 */
  background-color: var(--frosted-background-color);
  backdrop-filter: var(--frosted-backdrop-filter);
  -webkit-backdrop-filter: var(--frosted-webkit-backdrop-filter);

  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--navbar-height);
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  border-bottom: 1px solid var(--border-color);
  
}

.logo-section {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.site-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-md);
  margin-left: 10px;
  color: var(--text-color);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.nav-links {
  display: flex;
}

.nav-item {
  text-decoration: none;
  color: var(--text-color);
  font-size: var(--font-size-base);
  transition: color 0.3s ease;
  margin-right: 30px;
}

.nav-item:hover {
  color: var(--color-primary);
}

.is-active {
  color: var(--color-primary-hover);
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 15px;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: var(--text-color);
  border-radius: 2px;
}

/* 👇 移动端媒体查询 */
@media (max-width: 768px) {
  .site-title {
    display: none;
  }
  
  /* 移动端显示汉堡菜单，隐藏顶部导航链接（因为导航链接放进侧边栏了） */
  .hamburger {
    display: flex; 
  }
  /* .nav-links {
    display: none; 
  } */
}
</style>