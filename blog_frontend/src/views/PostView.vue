<template>
  <main class="post-view">
    <p v-if="loading" class="state">加载中...</p>
    <p v-else-if="error" class="state">{{ error }}</p>

    <article v-else-if="post" class="post">
      <h1 class="post-title">{{ post.title }}</h1>

      <div class="post-meta">
        <time class="post-date" :datetime="post.publishedAt ?? undefined">
          {{ formatDate(post.publishedAt) }}
        </time>
        <ul class="tag-list">
          <li v-for="tag in post.tags" :key="tag.id" class="tag-item">
            {{ tag.name }}
          </li>
        </ul>
      </div>

      <pre class="post-content">{{ post.content }}</pre>
    </article>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPost, type Post } from '@/api/post/posts'

const route = useRoute()
const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref('')

function formatDate(value: string | null) {
  if (!value) return ''
  const d = new Date(value)
  const y = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

onMounted(async () => {
  try {
    post.value = await getPost(String(route.params.slug))
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.post-view {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-md);
  color: var(--text-color);
}

.state {
  padding: var(--spacing-lg) 0;
  text-align: center;
  color: var(--text-color-secondary);
}

.post-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-md);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.post-date {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.tag-list {
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tag-item {
  padding: 2px 10px;
  border-radius: 999px;
  background-color: var(--bg-color-secondary);
  color: var(--color-primary);
  font-size: 0.75rem;
}

.post-content {
  margin-top: var(--spacing-lg);
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  line-height: 1.8;
}
</style>