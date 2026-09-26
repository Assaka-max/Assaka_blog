<template>
  <div class="sidebar" :class="{'is-open': isOpen}">
    <img src="../assets/avatar.jpg" alt="Avatar" class="avatar">
    <p style="line-height: 0px; font-weight: 500;">Assaka</p>

    <div class="stats">
      <PostsStat />
      <TagsStat />
    </div>

    <div class="social">
      <ThemeToggle></ThemeToggle>
      <SocialLink></SocialLink>
    </div>

  </div>
</template>

<script setup lang="ts">
  import SocialLink from './SocialLink.vue';
  import ThemeToggle from './ThemeToggle.vue';
  import PostsStat from './stats/PostsStat.vue';
  import TagsStat from './stats/TagsStat.vue';
  defineProps<{ isOpen: boolean}>()
  defineEmits<{ (e: 'close-sidebar'): void}>()
</script>

<style scoped>
.sidebar {
  width: 250px; /* 侧边栏固定宽度 */
  /* 防止被文章挤扁：flex-shrink: 0;  */
  position: sticky; /* 侧边栏跟随滚动 */
  top: 80px; /* 导航栏高度(60) + 一点间距(20) */
  
  display: flex;
  flex-direction: column;
  align-items: center;   /* 所有子元素水平居中 */
  text-align: center;    /* 文字居中仍然保留 */
  gap: 10px;
  box-shadow: 0 5px 10px rgba(0,0,0,0.1);
  border-radius: 10px;
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

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 10px;
}

.social {
  display: flex;
  gap: 20px;
}

.stats {
  display: flex;
  gap: 20px;
}
</style>