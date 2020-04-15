import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';
import Dashboard from '@/components/dashboard/dashboard.vue';
import SignUp from '@/components/sign-up/sign-up.vue';
import Login from '@/components/login/login.vue';
import Settings from '@/components/settings/settings.vue';
import FindPartner from '@/components/find-partner/find-partner.vue';

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
    component: Settings,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/find',
    name: 'FindPartner',
    component: FindPartner,
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
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('sign-in');
  else if (!requiresAuth && currentUser) next('dashboard');
  else next();
});

export default router;
