// src/router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import HKPage from './views/HKPage.vue';
import MainLayout from './layouts/MainLayout.vue';
// import GraphPage from './views/GraphPage.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'map', component: HKPage },
      // { path: 'graph', name: 'graph', component: GraphPage },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory('/hollowknight-app/'),
  routes,
});

export default router;
