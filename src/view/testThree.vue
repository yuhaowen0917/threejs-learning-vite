<template>
  <div class="test-three" ref="testThree"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const testThree = ref("");

// 创建场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 初始化相机位置
camera.position.set(-2, 1, 6);
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 创建立方体
const geometry = new THREE.BoxGeometry();

// 材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// 网格
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 添加网格地面
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
// 设置渲染器的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

const render = () => {
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
  // cube.position.x += 0.01;
};

// 挂载完毕之后获取dom
onMounted(() => {
  testThree.value.appendChild(renderer.domElement);
  render();
});
</script>

<style lang="scss" scoped>
.test-three {
  // height: 100vh;
  // width: 100vw;
}
</style>