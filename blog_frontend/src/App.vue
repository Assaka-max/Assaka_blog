<script setup lang="ts">
  import NavBar from './components/NavBar.vue';
</script>

<template>
  <div class="app-wrapper">
    <NavBar></NavBar>
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
}
</style>
