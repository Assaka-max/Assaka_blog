<template>
  <RouterLink :to="`/tags/${tag.slug}`" class="tag-item">
    {{ tag.name }}
  </RouterLink>
</template>

<script setup lang="ts">
import type { PostTag } from '@/api/post/posts';

defineProps<{ tag : PostTag }>()
</script>

<style scoped>
.tag-item {
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid var(--border-color-secondary);
  color: var(--color-primary);
  font-size: 0.75rem;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
}

.tag-item:hover {
  background-color: var(--bg-color-secondary);
}
</style>
