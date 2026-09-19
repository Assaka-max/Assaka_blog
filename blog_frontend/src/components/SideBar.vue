<template>
  <div class="sidebar" :class="{'is-open': isOpen}">
    <h1>侧边栏</h1>
    <ThemeToggle></ThemeToggle>
  </div>
</template>

<script setup lang="ts">
  import ThemeToggle from './ThemeToggle.vue';
  defineProps<{ isOpen: boolean}>()
  defineEmits<{ (e: 'close-sidebar'): void}>()
</script>

<style scoped>
.sidebar {
  width: 250px; /* 侧边栏固定宽度 */
  /* 防止被文章挤扁：flex-shrink: 0;  */
  position: sticky; /* 侧边栏跟随滚动 */
  top: 80px; /* 导航栏高度(60) + 一点间距(20) */
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: var(--navbar-height);
    right: -100%; /* 默认移出屏幕外 */
    width: 250px;
    height: calc(100vh - var(--navbar-height));
    z-index: 200; /* 高于遮罩层 */

    /* 磨砂效果 */
    background-color: var(--frosted-background-color);
    backdrop-filter: var(--frosted-backdrop-filter);
    -webkit-backdrop-filter: var(--frosted-webkit-backdrop-filter);

    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 滑入动画 */
    padding: 20px;
    overflow-y: auto; /* 内容多时内部可滚动 */
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  }

  /* 激活状态：滑入屏幕 */
  .sidebar.is-open {
    right: 0;
  }
}
</style>