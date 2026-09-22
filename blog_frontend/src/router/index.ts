import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('../views/HomeView.vue')
    }
    //等等
  ]
})

export default router