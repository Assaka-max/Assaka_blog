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
      path: '/archive',
      name: 'archive',
      component: () => import('../views/ArchiveView.vue')
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('../views/TagsView.vue')
    },
    {
      path: '/posts/:slug',
      name: 'post',
      component: () => import('../views/PostView.vue')
    },
    {
      path: '/tags/:slug',
      name: 'tagPost',
      component: () => import('../views/TagPostView.vue')
    },
    {
      path: '/pages/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    //等等
  ]
})

export default router