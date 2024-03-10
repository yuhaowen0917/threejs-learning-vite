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
  {
    path: "/customize-Uv-coordinate",
    name: "CustomizeUvCoordinate",
    component: () => import("../view/CustomizeUvCoordinate.vue"),
  },
  {
    path: "/light",
    name: "AmbientLight",
    component: () => import("../view/AmbientLight.vue"),
  },
  {
    path: "/vector",
    name: "VectorModel",
    component: () => import("../view/VectorModel.vue"),
  },
  {
    path: "/import-models",
    name: "ImportModel",
    component: () => import("../view/ImportModel.vue"),
  },
  {
    path: "/test-pages",
    name: "testPages",
    component: () => import("../view/pages/pages.vue"),
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
