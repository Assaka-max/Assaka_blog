<template>
  <button class="theme-toggle" @click="toggleTheme" :aria-pressed="isDark">
    {{ isDark ? '☀️' : '🌙' }}
  </button>
</template>

<script setup>
  import {onMounted, ref} from 'vue'

  const isDark = ref(false)

  onMounted(() => {
    isDark.value = document.documentElement.getAttribute('data-theme') === 'dark'
  })

  function toggleTheme() {
    isDark.value = !isDark.value
    const theme = isDark.value ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }
</script>