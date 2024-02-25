<template>
  <div class="box-geometry" ref="boxGeometry"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const boxGeometry = ref("");

// 初始化场景
const scene = new THREE.Scene();
// 添加背景色
scene.background = new THREE.Color(0x666666);
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 初始化相机位置
camera.position.set(-2, 8, 8);
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
  // 对数深度缓冲区
  logarithmicDepthBuffer: true,
});
// 设置渲染器的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const render = () => {
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
};

// 挂载完毕之后获取dom
onMounted(() => {
  // 创建轨道控制器
  const controls = new OrbitControls(camera, boxGeometry.value);
  // 设置控制器阻尼，是控制器效果更真实，必须在动画循环里调用.update()
  controls.enableDamping = true;
  boxGeometry.value.appendChild(renderer.domElement);
  render();
});

// // 创建平面几何体
// const geometry = new THREE.PlaneGeometry(4, 4);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xffff00,
//   side: THREE.DoubleSide,
//   wireframe: true,
// });
// const plane = new THREE.Mesh(geometry, material);
// console.log(geometry);
// scene.add(plane);

const geometry = new THREE.BufferGeometry();
// 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
// 因为在两个三角面片里，这两个顶点都需要被用到。
const vertices = new Float32Array([
  -1.0, -1.0, 1.0,

  1.0, -1.0, 1.0,

  1.0, 1.0, 1.0,

  1.0, 1.0, 1.0,

  -1.0, 1.0, 1.0,

  -1.0, -1.0, 1.0,
]);

// itemSize = 3 因为每个顶点都是一个三元组。
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
</script>

<style lang="scss" scoped>
</style>