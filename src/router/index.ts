import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/patients",
      name: "patients",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/PatientsView.vue"),
    },
    {
      path: "/patient-simulation",
      name: "patient-simulation",
      component: () => import("../views/PatientSimulationView.vue"),
    },
    {
      path: "/create-patient",
      name: "create-patient",
      component: () => import("../views/CreatePatientView.vue"),
    },
  ],
});

export default router;
