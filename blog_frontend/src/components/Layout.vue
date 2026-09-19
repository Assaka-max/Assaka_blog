<template>

  <div class="main-layout">

    <!-- 移动端遮罩层 -->
    <div 
      v-if="isSidebarOpen" 
      class="sidebar-overlay" 
      @click="$emit('close-sidebar')"
    ></div>

    <SideBar :is-open="isSidebarOpen" @close-sidebar="$emit('close-sidebar')"></SideBar>

    <main class="content">
      <router-view></router-view>
    </main>
  </div>
  
</template>

<script setup lang="ts">
  import SideBar from './SideBar.vue';
  defineProps<{isSidebarOpen: boolean}>()
  defineEmits<{ (e: 'close-sidebar'): void}>()
</script>

<style scoped>
.main-layout {
  display: flex;
  max-width: var(--max-width);
  margin: 0 auto;
  gap: 20px; /* 侧边栏和文章之间的间距 */
  padding: 20px;
  align-items: flex-start; /* 顶部对齐，防止侧边栏被拉伸 */
}

.content {
  flex: 1; /* 文章区占据剩余宽度 */
  min-width: 0; /* 核心细节：防止宽表格或长代码撑破页面 */
}

/* 移动端遮罩层样式 */
.sidebar-overlay {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  width: 100vw;
  height: calc(100vh - var(--navbar-height));
  background: rgba(0, 0, 0, 0.2);
  z-index: 150; /* 高于内容，低于侧边栏 */
}
</style>