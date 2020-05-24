import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from '@/config/firebase-config';
import Dashboard from '@/components/dashboard/dashboard.vue';
import SignUp from '@/components/sign-up/sign-up.vue';
import Login from '@/components/login/login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    redirect: '/login',
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () =>
      import(/* webpackChunkName: "settings" */ '@/components/settings/settings.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/find',
    name: 'Find',
    component: () =>
      import(/* webpackChunkName: "find" */ '@/components/find-partner/find-partner.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/connections',
    name: 'Connections',
    component: () =>
      import(/* webpackChunkName: "connections" */ '@/components/connections/connections.vue'),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth.currentUser;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('sign-in');
  else if (!requiresAuth && currentUser) next('dashboard');
  else next();
});

export default router;
