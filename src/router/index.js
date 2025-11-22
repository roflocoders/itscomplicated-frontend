import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Feed",
    component: () => import("../views/Feed.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/:username",
    name: "UserProfile",
    component: () => import("../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if ((to.name === "Login" || to.name === "Register") && token) {
    next("/");
  } else {
    next();
  }
});

export default router;
