<template>
  <div class="test-three" ref="modules">
    <!-- 灯光 环境光 平行光 点光源 聚光灯 -->
  </div>
</template>
    
<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const modules = ref("");

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
camera.position.set(60, 60, 70);
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

// 添加网格地面
const gridHelper = new THREE.GridHelper(40, 40);
scene.add(gridHelper);

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
// 6. 显示坐标轴(x轴: 红色; y轴: 绿色; z轴: 蓝色 rgb)
// x轴水平方向(右正); y轴垂直方向(上正); z轴垂直xy平面即屏幕(外正)
const axesHelper = new THREE.AxesHelper(4);
// axesHelper.position.y = 3;
scene.add(axesHelper);

// 创建材质
const material = new THREE.MeshPhongMaterial({
  color: 0xff2200,
});

// 创建GLTF实例
const loader = new GLTFLoader();
// 加载模型
loader.load("./models/glbModels/medieval_fantasy_book.glb", function (glb) {
  console.log("glb", glb);
  // 遍历模型中的物体
  glb.scene.traverse((child) => {
    // console.log(child);
    if (child.name === "Cube008__0") {
      child.material = material;
    }
    if (child.name === "Sketchfab_Scene") {
      child.material = material;
    }
  });
  // glb.scene.scale.set(20, 20, 20);
  glb.scene.position.set(0, 20, 0);

  scene.add(glb.scene);
});

// 环境光
const light = new THREE.AmbientLight(0x404040, 1); // 柔和的白光 color : 颜色, intensity : 光照强度
scene.add(light);

// 平行光
const directional_light = new THREE.DirectionalLight(0xffffff, 10);
directional_light.position.set(110, 110, 7);
scene.add(directional_light);

// 点光源
const point_light = new THREE.PointLight(0xffffff, 400, 100);
point_light.position.set(180, 150, -50);
point_light.castShadow = true;
scene.add(point_light);

// 添加灯光辅助
scene.add(new THREE.PointLightHelper(point_light, 10));

// 挂载完毕之后获取dom
onMounted(() => {
  modules.value.appendChild(renderer.domElement);
  render();
});
</script>
    
<style lang="scss">
div{
  color: #fcfcfc;
}
</style>