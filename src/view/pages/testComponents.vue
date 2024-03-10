<template>
  <div ref="testModels" class="test-models">111</div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const testModels = ref("");

// 创建场景
const scene = new THREE.Scene();
// 添加背景色
scene.background = new THREE.Color(0x666666);

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
// 初始化相机位置
camera.position.set(-2, 8, 12);
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头矩阵
camera.updateProjectionMatrix();
scene.add(camera);

onMounted(() => {
  console.log(
    testModels.value,
    testModels.value.clientWidth,
    testModels.value.clientHeight
  );
});
</script>

<style lang="scss" scoped>
.test-models {
  width: 100%;
  height: 100%;
  border: 1px solid #ff2a2a;
}
</style>