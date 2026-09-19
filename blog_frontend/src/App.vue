<script setup lang="ts">
  import NavBar from './components/NavBar.vue';
  import ThemeToggle from './components/ThemeToggle.vue';
</script>

<template>
  <div class="app-wrapper">
    <NavBar></NavBar>
    <ThemeToggle></ThemeToggle>
  </div>
  <main class="main-content">
    <router-view></router-view>
  </main>
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
