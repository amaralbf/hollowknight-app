// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "./layouts/MainLayout.vue";
import HKMapPage from "./views/HKMapPage.vue";
import GraphPage from "./views/GraphPage.vue";

const routes = [
  {
    path: "/hollowknight-app/",
    component: MainLayout,
    children: [
      { path: "", name: "map", component: HKMapPage },
      { path: "graph", name: "graph", component: GraphPage },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
