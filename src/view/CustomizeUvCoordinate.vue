<template>
  <div class="test-three" ref="cstomCoordinates">
    <!-- 自定义uv地址 -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const cstomCoordinates = ref("");

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

// 创建立方体
// const geometry = new THREE.BoxGeometry(1, 1, 1);

// 创建几何体
// const geometry = new THREE.SphereGeometry(3, 32, 16);

// 创建矩形
const geometry = new THREE.PlaneGeometry(2, 2);
console.log(geometry);

// 创建一个纹理对象
const texture = new THREE.TextureLoader().load("src/assets/textures/02.jpg");

// 定义UV像素取值范围 左上 右上 左下 右下
const uv =  new Float32Array([
  0, 0.5,
  0.5, 0.5,
  0, 0,
  0.5, 0
])

geometry.attributes.uv = new THREE.BufferAttribute(uv, 2)

// 创建基础网格材质
const material = new THREE.MeshBasicMaterial({
  // color: 0xffffff,
  map: texture,
});

// 网格
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 1, 0);
scene.add(cube);

// 添加网格地面
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
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
  // cube.position.x += 0.01;
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

// 自动旋转
// controls.autoRotate = true;
// controls.autoRotateSpeed = 0.5;

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(4);
axesHelper.position.y = 3;
scene.add(axesHelper);

// 挂载完毕之后获取dom
onMounted(() => {
  cstomCoordinates.value.appendChild(renderer.domElement);
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