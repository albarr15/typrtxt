import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    // lazy loaded route
    path: '/lib',
    name: 'Library',
    component: () => import('../views/Library.vue'),
  },
  {
    // lazy loaded route
    path: '/test',
    name: 'TypingTest',
    component: () => import('../views/TypingTest.vue'),
  },
  {
    // lazy loaded route
    path: '/stats',
    name: 'Statistics',
    component: () => import('../views/Stats.vue'),
  },
  {
    // lazy loaded route
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
  },
  {
    // lazy loaded route
    path: '/book/:id',
    name: 'Book',
    component: () => import('../views/BookOverview.vue'),
    props: true,
  },
  {
    // lazy loaded route
    path: '/text-content/:id',
    name: 'TextContent',
    component: () => import('../components/TextContent.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
