import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "testThree",
    component: () => import("../view/testThree.vue"),
  },
  {
    path: "/box-geometry",
    name: "BoxGeometry",
    component: () => import("../view/BoxGeometry.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   // 不同的页面有不同的title标题
//   console.log(to, from);
//   next();
// });

export default router;
