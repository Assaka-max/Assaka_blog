<template>
  <StatItem
    to="/tags"
    label="TAGS"
    :value="count"
    :loading="loading"
    :error="error"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import StatItem from './StatItem.vue'
import { getTagsSum } from '@/api/tag/tags.ts'

const count = ref(0)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try{
    count.value = await getTagsSum()
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载失败'
  } finally {
    loading.value = false
  }
})
</script>