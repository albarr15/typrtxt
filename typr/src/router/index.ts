import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        // lazy loaded route
        path: '/lib',
        name: 'Library',
        component: () => import('../views/Library.vue')
    },
    {
        // lazy loaded route
        path: '/test',
        name: 'TypingTest',
        component: () => import('../views/TypingTest.vue')
    },
    {
        // lazy loaded route
        path: '/stats',
        name: 'Statistics',
        component: () => import('../views/Stats.vue')
    },
    {
        // lazy loaded route
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue')
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router