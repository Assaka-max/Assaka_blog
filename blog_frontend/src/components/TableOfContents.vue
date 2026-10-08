<template>
  <aside class="toc-container">
    <div class="toc-card">
      <h3 class="toc-title">目录</h3>
      <ul v-if="items.length > 0" class="toc-list">
        <li v-for="item in items" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="toc-link"
            :class="{ 'is-active': activeId === item.id }"
            :style="{ paddingLeft: `${(item.level - 2) * 12}px` }"
            @click.prevent="scrollTo(item.id)"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
      <p v-else class="toc-empty">暂无目录</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onUnmounted, nextTick, watch } from 'vue'
import type { TocItem } from '@/utils/markdown'

const props = defineProps<{ items: TocItem[] }>()

const activeId = ref('')

let observer: IntersectionObserver | null = null

// 平滑滚动
const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    // 使用 scrollIntoView 实现平滑滚动
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const setupObserver = () => {
  if (observer) observer.disconnect()
  if (props.items.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // 当某个标题进入视口顶部区域时，更新高亮
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    {
      // 调整 rootMargin，让标题刚过导航栏时就触发高亮
      // 这里的 -80px 是为了避开顶部固定导航栏
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    }
  )

  props.items.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el) observer?.observe(el)
  })
}

watch(
  () => props.items,
  async () => {
    await nextTick()
    setupObserver()
  },
  { immediate: true }
)

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.toc-container {
  width: 220px; /* 目录宽度 */
  flex-shrink: 0;
}

.toc-card {
  position: sticky;
  top: 80px; /* 避开顶部导航栏 */
  background-color: var(--bg-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.toc-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-color);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 4px;
}

.toc-empty {
  margin: 0;
  font-size: 14px;
  color: var(--text-color-secondary);
}

.toc-link {
  display: block;
  padding: 4px 0;
  font-size: 14px;
  color: var(--text-color-secondary);
  text-decoration: none;
  transition: color 0.2s;
  border-radius: 4px;
}

.toc-link:hover {
  color: var(--color-primary);
}

/* 👇 高亮状态 */
.toc-link.is-active {
  color: var(--color-primary);
  font-weight: 600;
  background-color: var(--bg-color-secondary);
}

/* 👇 移动端隐藏 */
@media (max-width: 768px) {
  .toc-container {
    display: none;
  }
}
</style>
