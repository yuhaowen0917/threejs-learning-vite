<template>
  <div class="test-three" ref="lightModule">
    <!-- 灯光 环境光 平行光 点光源 聚光灯 -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const lightModule = ref("");

// 创建场景
const scene = new THREE.Scene();
// 添加背景色
scene.background = new THREE.Color(0x666666);

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 初始化相机位置
camera.position.set(-2, 4, 6);
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
// 设置渲染器的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
});

// 创建立方体
const geometry = new THREE.BoxGeometry(2, 2, 2);
// const geometry = new THREE.SphereGeometry(3, 32, 16);
console.log(geometry);

// 创建基础网格材质
const material = new THREE.MeshPhongMaterial({
  color: 0x0099ff,
  // shininess: 1000,
});

// Mesh网格
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 1, 0);
// 物体接收光源
// cube.receiveShadow = true;
// 物体投射光源
cube.castShadow = true;

scene.add(cube);

// 添加灯光效果
// 环境光
const light = new THREE.AmbientLight(0xffffff, 1); // 柔和的白光 color : 颜色, intensity : 光照强度
scene.add(light);

// 点光源
const point_light = new THREE.PointLight(0xffffff, 400, 100);
point_light.position.set(5, 5, 5);
point_light.castShadow = true;
// scene.add(point_light);

const spotLight = new THREE.SpotLight(0xffffff, 400);
spotLight.position.set(2, 6, 2);
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
spotLight.shadow.camera.near = 5;
spotLight.shadow.camera.far = 500;
spotLight.shadow.camera.fov = 3;
scene.add(spotLight);

// 创建地面
const ground = new THREE.PlaneGeometry(30, 25); // 模型
const ground_material = new THREE.MeshPhongMaterial({
  color: 0x1b5e20,
  shininess: 100
}); // 材质
const ground_cube = new THREE.Mesh(ground, ground_material); // 网格
// cube.position.set(0, 1, 0);
ground_cube.rotation.x -= Math.PI / 2;
// 地面设置接收光源
ground_cube.receiveShadow = true;
scene.add(ground_cube);

// 添加网格地面
// const gridHelper = new THREE.GridHelper(20, 20);
// scene.add(gridHelper);

const render = () => {
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
};

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 对轨道控制器改变时进行监听
// controls.addEventListener("change", function () {
//   console.log("触发change");
// });

// 设置控制器阻尼，是控制器效果更真实，必须在动画循环里调用.update()
controls.enableDamping = false;
controls.dampingFactor = 0.01;
controls.update();

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(4);
// axesHelper.position.y = 3;
scene.add(axesHelper);

// 挂载完毕之后获取dom
onMounted(() => {
  lightModule.value.appendChild(renderer.domElement);
  render();
});
</script>

<style lang="scss">
#gui {
  position: absolute;
  right: 0;
  width: 300px;
}
</style>