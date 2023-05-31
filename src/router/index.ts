import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "Home" },
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
  ],
});

export default router;
