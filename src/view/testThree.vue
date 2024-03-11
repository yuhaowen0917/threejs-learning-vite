<template>
  <div class="test-three" ref="testThree">
    <!-- <button @click="moveCube">移动物体</button> -->
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import * as dat from "dat.gui";
const gui = new dat.GUI();

const controlData = {
  rotationSpeed: 0.02,
  color: "#ffffff",
  wireframe: false,
};
const f = gui.addFolder("配置");
f.add(controlData, "rotationSpeed").min(0.01).max(0.1).step(0.01);
// 颜色选择器
f.addColor(controlData, "color");
// checkbox
f.add(controlData, "wireframe");
f.domElement.id = "gui";
// f.open();

const testThree = ref("");

// 创建场景
const scene = new THREE.Scene();
// 添加背景色
// scene.background = new THREE.Color(0x666666);
// 添加背景图片
// scene.background = new THREE.CubeTextureLoader()
//   .setPath("src/assets/images/")
//   .load(["01.png", "01.png", "01.png", "01.png", "01.png", "01.png"]);
// 添加雾
// scene.fog = new THREE.Fog(0xcc00cc, 10, 15);

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

// 创建纹理
const texture = new THREE.TextureLoader().load("src/assets/textures/01.png");
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set(4, 4);

// 创建立体纹理
const loader = new THREE.CubeTextureLoader();
loader.setPath("src/assets/textures/restroom/");
const textureCube = loader.load([
  "7_r.jpg",
  "7_l.jpg",
  "7_u.jpg",
  "7_d.jpg",
  "7_f.jpg",
  "7_b.jpg",
]);
scene.background = textureCube;

// 创建立方体
// const geometry = new THREE.BoxGeometry(1, 1, 1);

// 创建几何体
const geometry = new THREE.SphereGeometry(3, 32, 16);
console.log(geometry);
// 材质
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  // map: texture,
  envMap: textureCube,
});

// 网格
const cube = new THREE.Mesh(geometry, material);
// cube.position.set(1, 1, 1);
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
  cube.material.color = new THREE.Color(controlData.color);
  material.wireframe = controlData.wireframe;
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
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(4);
axesHelper.position.y = 3;
scene.add(axesHelper);

// 挂载完毕之后获取dom
onMounted(() => {
  testThree.value.appendChild(f.domElement);
  testThree.value.appendChild(renderer.domElement);
  render();
});

const moveCube = () => {
  cube.position.set(1, 2, 1);
  camera.lookAt(camera.position);
};
</script>

<style lang="scss">
// .test-three {
//   // height: 100vh;
//   // width: 100vw;
// }
#gui {
  position: absolute;
  right: 0;
  width: 300px;
}
</style>