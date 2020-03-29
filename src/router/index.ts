import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "@/components/dashboard/dashboard.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/dashboard",
    name: "Home",
    component: Dashboard
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
