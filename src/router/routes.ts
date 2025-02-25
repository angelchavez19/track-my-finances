import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/p-onboarding.vue'),
  },
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/p-home.vue') },
      { path: 'transactions', component: () => import('pages/p-transactions.vue') },
      { path: 'settings', component: () => import('pages/p-settings.vue') },
    ],
  },
]

export default routes
