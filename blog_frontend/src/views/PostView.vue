<template>
  <main class="post-view">
    <p v-if="loading" class="state">加载中...</p>
    <p v-else-if="error" class="state">{{ error }}</p>

    <div v-else-if="post" class="post-layout">
      <article class="post">
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

        <div class="article-content" v-html="html"></div>
      </article>

      <TableOfContents v-if="toc.length > 0" :items="toc" />
    </div>
  </main>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { getPost, type Post } from '@/api/post/posts'
  import { renderMarkdown, type RenderedMarkdown } from '@/utils/markdown'
  import TableOfContents from '@/components/TableOfContents.vue'
  
  const route = useRoute()
  const post = ref<Post | null>(null)
  const loading = ref(true)
  const error = ref('')
  
  const rendered = computed<RenderedMarkdown>(() =>
    post.value ? renderMarkdown(post.value.content) : { html: '', toc: [] }
  )
  const html = computed(() => rendered.value.html)
  const toc = computed(() => rendered.value.toc)
  
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
  max-width: 1100px;
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

.post-layout {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
}

.post {
  flex: 1;
  min-width: 0;
}

.article-content {
  margin-top: var(--spacing-lg);
  line-height: 1.8;
  word-break: break-word;
}

.article-content :deep(h2),
.article-content :deep(h3) {
  scroll-margin-top: 80px;
}

.article-content :deep(h2) {
  margin: 1.6em 0 0.6em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--border-color);
}

.article-content :deep(h3) {
  margin: 1.4em 0 0.5em;
}

.article-content :deep(p) {
  margin: 0.8em 0;
}

.article-content :deep(a) {
  color: var(--color-primary);
}

.article-content :deep(img) {
  max-width: 100%;
}

.article-content :deep(pre) {
  padding: 12px 16px;
  border-radius: var(--border-radius);
  background-color: var(--bg-color-secondary);
  overflow-x: auto;
}

.article-content :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.9em;
}
</style>