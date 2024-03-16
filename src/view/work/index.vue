<template>
  <div class="test-three" ref="testModels"></div>
  <!-- <div class="btn-box"></div> -->
</template>
  
  <script setup>
import { ref, onMounted } from "vue";

import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

import Stats from "three/addons/libs/stats.module.js";

import * as TWEEN from "@tweenjs/tween.js";
// 导入动画库
import gsap from "gsap";

// 导入 dat.gui
import * as dat from "dat.gui";

// 性能监视器
const stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
// 将stats的界面对应左上角
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "50px";
stats.domElement.style.top = "00px";

const testModels = ref("");

onMounted(() => {
  testModels.value.appendChild(renderer.domElement);
  render();
  testModels.value.appendChild(stats.domElement);

  // initStlModels();
  initGtlModels();
  initGuiBox();
});

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
camera.position.set(600, 1500, 2000);
camera.aspect = window.innerWidth / window.innerHeight;
camera.lookAt(camera.position); //指相机看向三维中的某个位置
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
const gridHelper = new THREE.GridHelper(400, 400);
scene.add(gridHelper);

const render = () => {
  stats.update();
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
  // 动画函数 模型自带的动画
  // tick();

  // 动画更新 自定义
  TWEEN.update();
};

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，是控制器效果更真实，必须在动画循环里调用.update()
controls.enableDamping = false;
controls.dampingFactor = 0.01;
// controls.autoRotate = true; // 是否自动旋转
// controls.autoRotateSpeed = 0.01; // 围绕目标旋转的速度将有多快
controls.update();

// 加入辅助轴，查看3维坐标轴
const axesHelper = new THREE.AxesHelper(400);
// axesHelper.position.y = 3;
scene.add(axesHelper);

// 环境光
const light = new THREE.AmbientLight(0x404040, 100); // 柔和的白光 color : 颜色, intensity : 光照强度
scene.add(light);

// 平行光
const directional_light = new THREE.DirectionalLight(0xffffff, 10);
directional_light.position.set(1200, 1600, 1000);
scene.add(directional_light);

const directional_light_1 = new THREE.DirectionalLight(0xffffff, 10);
directional_light_1.position.set(-1000, 1400, -1000);
scene.add(directional_light_1);
// 点光源
const point_light = new THREE.PointLight(0xffffff, 400, 0);
point_light.position.set(-500, 800, -500);
point_light.castShadow = true;
scene.add(point_light);

// const point_light_1 = new THREE.PointLight(0xffffff, 40000, 0);
// point_light_1.position.set(100, 1200, -100);
// point_light_1.castShadow = true;
// scene.add(point_light_1);

// 动画函数
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  // Update controls
  controls.update();
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

// 点击模型事件
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
document.addEventListener("click", (event) => {
  // console.log(event);
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // console.log(pointer);
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera);
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    // 射线涉及到的物体集合
    // console.log(intersects[0].object.name);
    // intersects[0].object.rotation.x += (10 * Math.PI) / 180;
    // for (let i = 0; i <script intersects.length; i++) {
    //   intersects[i].object.material.color.set(0xff0000);
    //   intersects[i].object.rotation.x += (10 * Math.PI) / 180;
    //   intersects[i].object.position.x += 10;
    //   intersects[i].object.position.add(vector);
    // }
  }
});

const stlloader = new STLLoader();
const initStlModels = () => {
  stlloader.load("./models/workModels/base.stl", function (stl) {
    console.log("stl", stl);
    var material = baseMaterial;
    var mesh = new THREE.Mesh(stl, material); //网格模型对象Mesh
    mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
    // 物体接收光源
    mesh.receiveShadow = true;
    // 物体投射光源
    mesh.castShadow = true;
    scene.add(mesh);
  });
  stlloader.load("./models/workModels/j1.stl", function (stl) {
    console.log("stl", stl);
    var material = j1Material;
    var mesh = new THREE.Mesh(stl, material);
    mesh.rotation.x = -0.5 * Math.PI;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
  });
  stlloader.load("./models/workModels/j2.stl", function (stl) {
    console.log("stl", stl);
    var material = new THREE.MeshLambertMaterial({
      color: 0x7272ff,
    });
    var mesh = new THREE.Mesh(stl, material); //网格模型对象Mesh
    mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
    // 物体接收光源
    mesh.receiveShadow = true;
    // 物体投射光源
    mesh.castShadow = true;
    scene.add(mesh);
  });
};

// 创建GLTF实例
const gltfloader = new GLTFLoader();
let base_model;
let baseMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x2e2e2e,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  clearcoatNormalScale: 0.1,
});
let j1_model;
const j1_model_group = new THREE.Object3D();
j1_model_group.name = "j1_model_group";
let j1Material = new THREE.MeshPhysicalMaterial({
  color: 0x00ff00,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  // clearcoatNormalScale: 0.1
});
let j2_model;
const j2_model_group = new THREE.Object3D();
j2_model_group.name = "j2_model_group";
let j2Material = new THREE.MeshPhongMaterial({
  color: 0xcd39cd,
  shininess: 1000,
});
let j3_model;
const j3_model_group = new THREE.Object3D();
j3_model_group.name = "j3_model_group";
let j3Material = new THREE.MeshPhysicalMaterial({
  color: 0xdd0d0d,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  clearcoatNormalScale: 0.1,
});
let j4_model;
const j4_model_group = new THREE.Object3D();
j4_model_group.name = "j4_model_group";
let j4Material = new THREE.MeshPhysicalMaterial({
  color: 0xffeeff,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  clearcoatNormalScale: 0.1,
});
let j5_model;
const j5_model_group = new THREE.Object3D();
j5_model_group.name = "j5_model_group";
let j6_model;
const j6_model_group = new THREE.Object3D();
j6_model_group.name = "j6_model_group";
let j6Material = new THREE.MeshStandardMaterial({
  color: 0x2e2e2e,
});
let roboticArmModel;

const initGtlModels = () => {
  const group = new THREE.Group(); //实例化一个THREE.Object3D对象
  group.name = "robotic-arm";
  gltfloader.load("./models/workModels/base.glb", function (glb) {
    // console.log("glb", glb);
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        // console.log(child);
        child.material = baseMaterial;
      }
    });
    glb.scene.position.set(0, 0, 0);
    glb.scene.name = "base_model";
    base_model = glb.scene;
    // scene.add(glb.scene);
    group.add(base_model);
  });
  gltfloader.load("./models/workModels/j1.glb", function (glb) {
    // console.log("glb", glb);
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        // console.log(child);
        child.material = j1Material;
      }
    });
    // glb.scene.scale.set(0.01, 0.01, 0.01);
    glb.scene.position.set(0, 0, 0);
    glb.scene.name = "j1_model";
    j1_model = glb.scene;
    // group.add(j1_model);

    j1_model_group.add(j1_model.clone());
    group.add(j1_model_group);
  });
  gltfloader.load("./models/workModels/j2.glb", function (glb) {
    // console.log("glb", glb);
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = j2Material;
      }
    });
    // glb.scene.scale.set(0.01, 0.01, 0.01);
    glb.scene.position.set(0, 0, 0);
    glb.scene.name = "j2_model";
    j2_model = glb.scene;
    // group.add(j2_model);
    j2_model_group.add(j2_model.clone());
    j1_model_group.add(j2_model_group);
  });
  gltfloader.load("./models/workModels/j3.glb", function (glb) {
    // console.log("glb", glb);
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        // console.log(child);
        child.material = j3Material;
      }
    });
    glb.scene.position.set(0, 0, 0);
    glb.scene.name = "j3_model";
    j3_model = glb.scene;
    // scene.add(glb.scene);
    // group.add(j3_model);

    j3_model_group.add(j3_model.clone());
    j2_model_group.add(j3_model_group);
  });
  gltfloader.load("./models/workModels/j4.glb", function (glb) {
    // console.log("glb", glb);
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        // console.log(child);
        child.material = j4Material;
      }
    });
    glb.scene.position.set(0, 0, 0);
    j4_model = glb.scene;
    glb.scene.name = "j4_model";
    j4_model_group.add(j4_model.clone());
    j3_model_group.add(j4_model_group);
  });
  gltfloader.load("./models/workModels/j5.glb", function (glb) {
    // glb.scene.position.set(0, 0, 0);
    glb.scene.name = "j5_model";
    j5_model = glb.scene;

    j5_model_group.add(j5_model.clone());
    j4_model_group.add(j5_model_group);
  });
  gltfloader.load("./models/workModels/j6.glb", function (glb) {
    // console.log("glb", glb);
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        // console.log(child);
        child.material = j6Material;
      }
    });
    glb.scene.name = "j6_model";
    j6_model = glb.scene;
    glb.scene.position.set(0, 0, 0);

    j6_model_group.add(j6_model.clone());
    j5_model_group.add(j6_model_group);
  });
  console.log(group);
  roboticArmModel = group;
  // group 整体进行操作
  // group.rotation.y -= Math.PI / 2;
  // group.position.set(0, 1, 0);

  scene.add(group); //将对象组添加到场景当中

  // 模型分组
  // ModelsNested();
};

// GUI界面
const initGuiBox = () => {
  const controlData = {
    color: "#ffffff",
    visible: true,
    x: 0,
    y: 0,
    z: 0,
    rotation: 0,
  };
  const gui = new dat.GUI();
  gui.domElement.id = "gui_box";
  const base_folder = gui.addFolder("base");
  base_folder.addColor(controlData, "color").onChange((value) => {
    // scene.background = new THREE.Color(value);
    baseMaterial.color.set(value);
    // console.log(base_model);
  });
  base_folder
    .add(controlData, "visible")
    .name("visible")
    .onFinishChange((value) => {
      base_model.visible = value;
    });
  // base_folder.open();
  const j1_folder = gui.addFolder("j1");
  j1_folder.addColor(controlData, "color").onChange((value) => {
    j1Material.color.set(value);
  });
  j1_folder
    .add(controlData, "visible")
    .name("visible")
    .onFinishChange((value) => {
      j1_model_group.children[0].visible = value;
    });
  j1_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
    j1_model_group.rotation.y = value;
  });
  const j2_folder = gui.addFolder("j2");
  j2_folder.addColor(controlData, "color").onChange((value) => {
    j2Material.color.set(value);
  });
  j2_folder
    .add(controlData, "visible")
    .name("visible")
    .onFinishChange((value) => {
      j2_model_group.children[0].visible = value;
    });
  j2_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
    j2_model_group.rotation.z = value;
  });
  const j3_folder = gui.addFolder("j3");
  j3_folder.addColor(controlData, "color").onChange((value) => {
    j3Material.color.set(value);
  });
  j3_folder
    .add(controlData, "visible")
    .name("visible")
    .onFinishChange((value) => {
      j3_model_group.children[0].visible = value;
    });
  j3_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
    j3_model_group.rotation.z = value;
  });
  // j3_folder.open();
  const j4_folder = gui.addFolder("j4");
  j4_folder.addColor(controlData, "color").onChange((value) => {
    j4Material.color.set(value);
  });
  j4_folder
    .add(controlData, "visible")
    .name("visible")
    .onFinishChange((value) => {
      j4_model_group.children[0].visible = value;
    });
  j4_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
    j4_model_group.rotation.x = value;
  });
  const j5_folder = gui.addFolder("j5");
  j5_folder.addColor(controlData, "color").onChange((value) => {
    j5Material.color.set(value);
  });
  j5_folder
    .add(controlData, "visible")
    .name("visible")
    .onFinishChange((value) => {
      j5_model_group.children[0].visible = value;
    });
  j5_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
    j5_model_group.rotation.z = value;
  });
  const j6_folder = gui.addFolder("j6");
  j6_folder.addColor(controlData, "color").onChange((value) => {
    j6Material.color.set(value);
  });
  j6_folder
    .add(controlData, "visible")
    .name("visible")
    .onFinishChange((value) => {
      j6_model_group.children[0].visible = value;
    });
  j6_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
    j6_model_group.rotation.x = value;
  });
  const overall_folder = gui.addFolder("overall");
  overall_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
    roboticArmModel.rotation.y = value;
  });
  overall_folder.add(controlData, "x", -400, 400).onChange((value) => {
    roboticArmModel.position.x = value;
  });
};

console.log(scene);
</script>
  
<style lang="scss">
.btn-box {
  position: absolute;
  bottom: 10%;
  left: 10%;
}
#gui_box {
  position: absolute;
  right: 0;
  width: 300px;
}
</style>