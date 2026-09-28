<template>
  <main class="archive-view">

    <p v-if="loading" class="state">加载中...</p>
    <p v-else-if="error" class="state">加载失败</p>
    <p v-else-if="years.length == 0" class="state">暂无文章</p>

    <template v-else>
      <section v-for="group in years" :key="group.year" class="year-group">
        <h2 class="year-heading">{{ group.year }}</h2>
        <ul class="post-list">
          <li v-for="post in group.posts" :key="post.slug" class="post-item">
            <time class="post-date" :datetime="post.publishedAt ?? undefined">
              {{ formatDate(post.publishedAt) }}
            </time>
            <RouterLink class="post-title" :to="`/posts/${post.slug}`">
              {{ post.title }}
            </RouterLink>
          </li>
        </ul>
      </section>
    </template>

  </main>
</template>

<script setup lang="ts">
  import { getArchive, type ArchiveYear } from '@/api/post/archive'
  import { onMounted, ref } from 'vue'

  const years = ref<ArchiveYear[]>([])
  const loading = ref(true)
  const error = ref(false)

  function formatDate(value: string | null) {
    if (!value) return ''
    const d = new Date(value)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${mm}-${dd}`
  }

  onMounted(async () => {
    try {
      years.value = await getArchive()
    } catch (e) {
      error.value = true
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped>
.archive-view {
  max-width: 800px;
  margin: 0 auto;
  /* padding: var(--spacing-md); */
  color: var(--text-color);
}

.state {
  padding: var(--spacing-lg) 0;
  text-align: center;
  color: var(--text-color-secondary);
}

.year-heading {
  margin: var(--spacing-lg) 0 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-lg);
  padding-bottom: 1vw;
  border-bottom: 1px solid var(--border-color);
}

.post-list {
  margin: 0 1vw;
  padding: 0;
  list-style: none;
}

.post-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-md);
  border-bottom: 1px solid var(--border-color-secondary);
  padding: 18px;
  /* padding: 12px 0; */
}

.post-title {
  flex: 1;
  min-width: 0;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.post-title:hover {
  color: var(--color-primary);
}

.post-date {
  flex-shrink: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}
</style>