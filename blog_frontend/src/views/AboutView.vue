<template>
  <main class="about-view">
    <p v-if="loading" class="state">加载中...</p>
    <p v-else-if="error" class="state">{{ error }}</p>

    <div v-else-if="about" class="about-layout">
      <div class="about-content" v-html="html"></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { getPage, type Page } from '@/api/page/pages';
import { renderMarkdown, type RenderedMarkdown } from '@/utils/markdown';
import { computed, onMounted, ref } from 'vue';

  const about = ref<Page | null>(null)
  const loading = ref(true)
  const error = ref('')
  
  const rendered = computed<RenderedMarkdown>(() =>
    about.value ? renderMarkdown(about.value.content) : { html: '', toc: [] }
  )
  const html = computed(() => rendered.value.html)

  onMounted(async () => {
    try {
      about.value = await getPage('about')
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped>
.about-view {
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

.about-content {
  line-height: 1.8;
  word-break: break-word;
}

.about-content :deep(h2),
.about-content :deep(h3) {
  scroll-margin-top: 80px;
}

.about-content :deep(h2) {
  margin: 1.6em 0 0.6em;
}

.about-content :deep(h3) {
  margin: 1.4em 0 0.5em;
}

.about-content :deep(p) {
  margin: 0.8em 0;
}

.about-content :deep(a) {
  color: var(--color-primary);
}

.about-content :deep(img) {
  max-width: 100%;
}

.about-content :deep(pre) {
  padding: 12px 16px;
  border-radius: var(--border-radius);
  overflow-x: auto;
}

.about-content :deep(pre code) {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.9em;
}

.about-content :deep(:not(pre) > code) {
  padding: 0.15em 0.4em;
  border-radius: 4px;
  background-color: var(--bg-color-secondary);
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.9em;
}
</style>
