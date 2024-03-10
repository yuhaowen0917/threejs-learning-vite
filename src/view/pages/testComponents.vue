<template>
  <div ref="testModels" class="test-models"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const testModels = ref("");
const boxWidth = ref("");
const boxHeight = ref("");

let scene;
let camera;
let renderer;
let controls;
let axesHelper;

const initThreeModels = () => {
  // 创建场景
  scene = new THREE.Scene();
  // 添加背景色
  scene.background = new THREE.Color(0x666666);

  // 初始化相机
  camera = new THREE.PerspectiveCamera(
    80,
    testModels.value.clientWidth / testModels.value.clientHeight,
    0.1,
    10000
  );
  // 初始化相机位置
  camera.position.set(-2, 8, 12);
  camera.aspect = testModels.value.clientWidth / testModels.value.clientHeight;
  // 更新摄像头矩阵
  camera.updateProjectionMatrix();
  scene.add(camera);

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  // 设置渲染器的尺寸大小
  renderer.setSize(testModels.value.clientWidth, testModels.value.clientHeight);

  // 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
  window.addEventListener("resize", () => {
    // console.log(testModels.value.clientWidth, testModels.value.clientHeight);
    camera.aspect = testModels.value.clientWidth / testModels.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(testModels.value.clientWidth, testModels.value.clientHeight);
    renderer.shadowMap.enabled = true;
  });

  // 创建轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);

  // 设置控制器阻尼，是控制器效果更真实，必须在动画循环里调用.update()
  controls.enableDamping = false;
  controls.dampingFactor = 0.01;
  controls.update();

  // 加入辅助轴，帮助我们查看3维坐标轴
  // 6. 显示坐标轴(x轴: 红色; y轴: 绿色; z轴: 蓝色 rgb)
  // x轴水平方向(右正); y轴垂直方向(上正); z轴垂直xy平面即屏幕(外正)
  axesHelper = new THREE.AxesHelper(4);
  // axesHelper.position.y = 3;
  scene.add(axesHelper);

  // 创建立方体
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  // 创建基础网格材质
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff11,
  });
  // Mesh网格
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
};

const render = () => {
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
};

onMounted(() => {
  console.log(
    document.querySelector(".test-models"),
    testModels.value,
    testModels.value.clientWidth,
    testModels.value.clientHeight
  );
  boxWidth.value = testModels.value.clientWidth;
  boxHeight.value = testModels.value.clientHeight;
  initThreeModels();
  testModels.value.appendChild(renderer.domElement);
  render();
});
</script>

<style lang="scss" scoped>
.test-models {
  width: 100%;
  height: 100%;
  border: 1px solid #ff2a2a;
}
</style>