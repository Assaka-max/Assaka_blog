<template>
  <main class="tags-view">
    <h2 class="page-title">标签</h2>

    <p v-if="loading" class="state">加载中...</p>
    <p v-else-if="error" class="state">{{ error }}</p>
    <p v-else-if="tags.length === 0" class="state">暂无标签</p>

    <ul v-else class="tag-list">
      <li v-for="tag in tags" :key="tag.id">
        <RouterLink class="tag-item" :to="`/tags/${tag.slug}`">
          <span class="tag-name">{{ tag.name }}:</span>
          <span class="tag-count">{{ tag.count }}</span>
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getTagList, type TagWithCount } from '@/api/tag/tags'

const tags = ref<TagWithCount[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    tags.value = await getTagList()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.tags-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-md);
  margin-bottom: 20px;
}

.state {
  padding: var(--spacing-lg) 0;
  text-align: center;
  color: var(--text-color-secondary);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  background-color: var(--bg-color-secondary);
  color: var(--color-primary);
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.tag-item:hover {
  color: var(--color-primary-hover);
}

.tag-count {
  color: var(--text-color-secondary);
}
</style>