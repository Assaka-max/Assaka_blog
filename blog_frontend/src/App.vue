<script setup lang="ts">
  import {ref} from 'vue';
  import Layout from './components/Layout.vue';
  import NavBar from './components/NavBar.vue';

  const isSidebarOpen = ref(false)
</script>

<template>

  <NavBar @toggle-sidebar="isSidebarOpen = !isSidebarOpen"></NavBar>

  <Layout :is-sidebar-open="isSidebarOpen" @close-sidebar="isSidebarOpen = false"></Layout>
  
</template>


<style scoped>
</style>
<style>
body, html {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.2s ease, color 0.2s ease;
}
</style>
