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
  </header>
</template>

<script setup lang="ts">
  import {useRoute} from 'vue-router'

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-bottom: 1px solid #d6d5d5;
  
}

.logo-section {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.site-title {
  font-size: 18px;
  font-weight: 500;
  margin-left: 10px;
  color: #333;
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
  color: #333;
  font-size: 16px;
  transition: color 0.3s ease;
  margin-right: 30px;
}

.nav-item:hover {
  color: #42b883; /* 鼠标悬浮时的颜色（Vue绿） */
}

.is-active {
  color: #42b883;
}
</style>