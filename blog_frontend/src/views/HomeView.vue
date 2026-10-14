<template>
  <main class="home-view">

    <!-- 主页文章列表区域 -->
    <section class="post-list">
      <p v-if="loading" class="state">加载中...</p>
      <p v-else-if="error" class="state">{{ error }}</p>
      <p v-else-if="posts.length === 0" class="state">暂无文章</p>

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
    </section>
    
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getPostList, type PostCardItem } from '@/api/post/posts'
import PostCard from '@/components/PostCard.vue'

const posts = ref<PostCardItem[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const loading = ref(true)
const error = ref('')

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

async function fetchPosts() {
  loading.value = true
  error.value = ''
  try {
    const res = await getPostList(page.value, pageSize)
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

onMounted(fetchPosts)
</script>



<style scoped>
/* scoped 表示这些样式只对当前组件生效，不会污染其他页面 */
.home-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
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