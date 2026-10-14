<template>
  <article class="post-card">
    <RouterLink class="card-title" :to="`/posts/${post.slug}`">
      {{ post.title }}
    </RouterLink>

    <time class="card-time" :datetime="post.updatedAt">
      {{ formateDate(post.updatedAt) }}
    </time>

    <p v-if="post.summary" class="card-summary">{{ post.summary }}</p>

    <RouterLink class="more-link" :to="`/posts/${post.slug}`">
      查看更多
    </RouterLink>

    <ul class="tag-list">
      <li v-for="tag in post.tags" :key="tag.id" class="tag-item">
        {{ tag.name }}
      </li>
    </ul>

  </article>
</template>

<script setup lang="ts">
  import type { PostCardItem } from '@/api/post/posts'

  defineProps<{ post : PostCardItem }>()

  function formateDate(value: string) {
    const d = new Date (value)
    const y = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${mm}-${dd}`
  }
</script>

<style scoped>
  .post-card {
    display : flex;
    flex-direction : column;
    align-items : center;
    gap : 8px ;
    padding : 20px ;
    border-radius : var (--border-radius);
    background-color : var (--bg-color);
    border-top: 1px solid var(--border-color-secondary);
    box-shadow: 0 5px 10px rgba(0,0,0,0.1);
    border-radius: 10px;
  }

  .card-title {
    font-size : var(--font-size-title) ;
    color: var(--text-color);
    transition: color 0.3s ease;
    text-decoration : none;
  }

  .card-title:hover {
    color: var(--color-primary-hover);
  }
</style>


