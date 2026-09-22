<template>
  <RouterLink :to="to" class="stat-item">
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value">
      {{ loading ? '--' : error ? 'E' : value }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  to: string
  label: string
  value: number
  loading?: boolean
  error?: string | null
}>()
</script>

<style scoped>
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-1px);
}

.stat-item:hover .stat-label,
.stat-item:hover .stat-value {
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-color-secondary);
  transition: color 0.2s ease;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  transition: color 0.2s ease;
}
</style>