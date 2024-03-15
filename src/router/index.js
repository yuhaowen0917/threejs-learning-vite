import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "NavigationBar",
    component: () => import("../view/NavPage.vue"),
    meta: { desc: "导航页" },
  },
  {
    path: "/testThree",
    name: "testThree",
    component: () => import("../view/testThree.vue"),
    meta: { desc: "测试" },
  },
  {
    path: "/box-geometry",
    name: "BoxGeometry",
    component: () => import("../view/BoxGeometry.vue"),
    meta: { desc: "几何体测试" },
  },
  {
    path: "/customize-Uv-coordinate",
    name: "CustomizeUvCoordinate",
    component: () => import("../view/CustomizeUvCoordinate.vue"),
    meta: { desc: "自定义 UV 坐标" },
  },
  {
    path: "/light",
    name: "AmbientLight",
    component: () => import("../view/AmbientLight.vue"),
    meta: { desc: "灯光效果" },
  },
  {
    path: "/vector",
    name: "VectorModel",
    component: () => import("../view/VectorModel.vue"),
    meta: { desc: "三维向量（Vector3）" },
  },
  {
    path: "/import-models",
    name: "ImportModel",
    component: () => import("../view/ImportModel.vue"),
    meta: { desc: "导入模型测试" },
  },
  {
    path: "/test-pages",
    name: "testPages",
    component: () => import("../view/pages/pages.vue"),
    meta: { desc: "测试标签宽高变化，导入.stl格式和.glb格式模型,模型点击事件" },
  },
  {
    path: "/animation",
    name: "testAnimation",
    component: () => import("../view/Animation/testAnimation.vue"),
    meta: { desc: "测试动画模型的效果" },
  },
  {
    path: "/debug-actions",
    name: "debugActions",
    component: () => import("../view/Animation/debugActions.vue"),
    meta: { desc: "调试动作" },
  },
  {
    path: "/works",
    name: "WorksModel",
    component: () => import("../view/work/index.vue"),
    meta: { desc: "WorksModel" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   // 不同的页面有不同的desc标题
//   console.log(to, from);
//   next();
// });

export default router;
