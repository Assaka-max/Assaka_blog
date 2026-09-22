<template>
  <StatItem
    to="/posts"
    label="POSTS"
    :value="count"
    :loading="loading"
    :error="error"
  ></StatItem>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import StatItem from './StatItem.vue';
import { fetchSiteStats } from '@/api/stats.ts';

  const count = ref(0)
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try{
      const data = await fetchSiteStats()
      count.value = data.posts
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  })
</script>