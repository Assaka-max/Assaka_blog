<template>
  <a
      class="social-link"
      href="https://github.com/Assaka-max"
      target="_blank"
      rel="noopener"
      aria-label="GitHub"
    >
      <svg
        class="icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
      >
        <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
      </svg>
    </a>
</template>

<style scoped>
/* 与 ThemeToggle 保持一致的方形按钮样式 */
.social-link {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: transparent;
  color: var(--text-color); /* 图标颜色自动跟随主题 */
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.social-link:hover {
  background-color: var(--hover-background-color, rgba(128, 128, 128, 0.12));
}

.icon {
  display: block;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
</style>