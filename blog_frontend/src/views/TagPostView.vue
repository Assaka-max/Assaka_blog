<template>
  <main class="tag-posts-view">
    <h2 class="page-title">标签：{{ tagName }}</h2>

    <p v-if="loading" class="state">加载中...</p>
    <p v-else-if="error" class="state">{{ error }}</p>
    <p v-else-if="posts.length === 0" class="state">该标签下暂无文章</p>

    <template v-else>
      <div class="card-list">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <nav v-if="totalPages > 1" class="pagination">
        <button :disabled="page === 1" @click="goTo(page - 1)">上一页</button>
        <button
          v-for="p in totalPages"
          :key="p"
          :class="{ 'is-active': p === page }"
          @click="goTo(p)"
        >
          {{ p }}
        </button>
        <button :disabled="page === totalPages" @click="goTo(page + 1)">下一页</button>
      </nav>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPostList, type PostCardItem } from '@/api/post/posts'
import { getTagList } from '@/api/tag/tags'
import PostCard from '@/components/PostCard.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const tagName = ref(slug.value)
const posts = ref<PostCardItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const loading = ref(true)
const error = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

async function fetchTagName() {
  try {
    const list = await getTagList()
    tagName.value = list.find((t) => t.slug === slug.value)?.name ?? slug.value
  } catch {
    tagName.value = slug.value
  }
}

async function fetchPosts() {
  loading.value = true
  error.value = ''
  try {
    const res = await getPostList(page.value, pageSize, slug.value)
    posts.value = res.list
    total.value = res.total
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
}

function goTo(target: number) {
  if (target < 1 || target > totalPages.value || target === page.value) return
  page.value = target
  fetchPosts()
}

async function load() {
  page.value = 1
  tagName.value = slug.value
  await Promise.all([fetchTagName(), fetchPosts()])
}

watch(slug, load)
onMounted(load)
</script>

<style scoped>
.tag-posts-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-md);
  margin-bottom: 20px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.state {
  padding: var(--spacing-lg) 0;
  text-align: center;
  color: var(--text-color-secondary);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.pagination button {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-color);
  color: var(--text-color);
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button.is-active {
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
}
</style>