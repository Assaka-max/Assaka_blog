<template>
  <button class="theme-toggle" @click="toggleTheme" :aria-pressed="isDark">
    <!-- {{ isDark ? '☀️' : '🌙' }} -->
    <svg
      v-if="!isDark"
      class="icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
    <svg
      v-else
      class="icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
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

<style scoped>
.theme-toggle {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--text-color); /* 图标颜色自动跟随主题 */
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.icon {
  display: block;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
</style>