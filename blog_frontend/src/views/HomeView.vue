<script setup lang="ts">
import { ref } from 'vue'

// 模拟一些博客文章数据
const posts = ref([
  { id: 1, title: '我的第一篇博客', date: '2026-09-18' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
  { id: 2, title: 'Vue3 + TypeScript 学习笔记', date: '2026-09-17' },
])
</script>

<template>
  <div class="home-view">
    <!-- 个人简介区域 -->
    <section class="hero-section">
      <h1>欢迎来到 lly 的博客</h1>
      <p>记录生活，分享技术。</p>
    </section>

    <!-- 文章列表区域 -->
    <section class="post-list">
      <h2>最新文章</h2>
      <ul>
        <li v-for="post in posts" :key="post.id" class="post-item">
          <span class="post-title">{{ post.title }}</span>
          <span class="post-date">{{ post.date }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* scoped 表示这些样式只对当前组件生效，不会污染其他页面 */
.home-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.hero-section {
  text-align: center;
  padding: 40px 0;
  background-color: #f0fdf4; /* 淡淡的绿色背景 */
  border-radius: 12px;
  margin-bottom: 30px;
}

.post-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px dashed #eee;
}

.post-title {
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.post-title:hover {
  color: #42b883;
}

.post-date {
  color: #999;
  font-size: 14px;
}
</style>