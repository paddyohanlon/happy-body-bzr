import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MeasurementsView from "../views/MeasurementsView.vue";
import ProfileView from "../views/ProfileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/measurements",
      name: "measurements",
      component: MeasurementsView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
  ],
});

export default router;
