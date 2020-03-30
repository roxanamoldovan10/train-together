import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase";
import Dashboard from "@/components/dashboard/dashboard.vue";
import SignIn from "@/components/sign-in/sign-in.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/sign-in"
  },
  {
    path: "/dashboard",
    name: "Home",
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next("sign-in");
  else if (!requiresAuth && currentUser) next("dashboard");
  else next();
});

export default router;
