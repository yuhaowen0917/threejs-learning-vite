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
// 现后期处理效果
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";

// 拖放控制器
import { DragControls } from "three/addons/controls/DragControls.js";

import * as TWEEN from "@tweenjs/tween.js";
// 导入动画库
// import gsap from "gsap";

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

  // console.log(testModels.value);

  // initStlModels();
  initGtlModels();
  initGuiBox();

  // rightClickMoveModel();
  testModels.value.appendChild(gui.domElement);
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
  10000 * 10
);

// 初始化相机位置
camera.position.set(500, 1500, 1800);
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
  renderer.shadowMap.enabled = true; // 开启阴影渲染功能
});

// 添加网格地面
// const gridHelper = new THREE.GridHelper(1000, 1000);
// scene.add(gridHelper);

// 创建地面
const ground = new THREE.PlaneGeometry(3000, 2000); // 模型
const ground_material = new THREE.MeshPhongMaterial({
  color: 0x484848,
  shininess: 100,
  side: THREE.DoubleSide, // 允许平面几何体双面渲染
});
// const ground_material = new THREE.MeshPhysicalMaterial({
//   color: 0x484848,
//   metalness: 1.0,
//   roughness: 0.5,
//   clearcoat: 1.0,
//   clearcoatRoughness: 0.05,
//   clearcoatNormalScale: 0.1,
//   side: THREE.DoubleSide, // 允许平面几何体双面渲染
// });
const ground_cube = new THREE.Mesh(ground, ground_material); // 网格
ground_cube.rotation.x -= Math.PI / 2;
// 地面设置接收光源
ground_cube.receiveShadow = true;
ground_cube.name = "ground";
scene.add(ground_cube);

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

  if (composer) {
    composer.render(scene, camera);
  }
};

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，是控制器效果更真实，必须在动画循环里调用.update()
controls.enableDamping = false;
controls.dampingFactor = 0.01;
controls.enablePan = true; // 启用或禁用摄像机平移，默认为true
controls.enableRotate = true; // 启用或禁用摄像机水平或垂直旋转。默认值为true
// controls.autoRotate = true; // 是否自动旋转
// controls.autoRotateSpeed = 0.01; // 围绕目标旋转的速度将有多快
controls.update();

// 加入辅助轴，查看3维坐标轴
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

// 环境光
const light = new THREE.AmbientLight(0x404040, 100); // 柔和的白光 color : 颜色, intensity : 光照强度
scene.add(light);

// 平行光
const directional_light = new THREE.DirectionalLight(0xffffff, 10);
directional_light.position.set(1200, 1600, 1000);
directional_light.castShadow = true;
scene.add(directional_light);

const directional_light_1 = new THREE.DirectionalLight(0xffffff, 10);
directional_light_1.position.set(-1000, 1400, -1000);
directional_light_1.castShadow = true;
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

const stlloader = new STLLoader();
const initStlModels = () => {
  stlloader.load("./models/workModels/base.stl", function (stl) {
    console.log("stl", stl);
    var material = baseMaterial;
    var mesh = new THREE.Mesh(stl, material); //网格模型对象Mesh
    mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
    mesh.position.x = 500;
    scene.add(mesh);
  });
  stlloader.load("./models/workModels/j1.stl", function (stl) {
    var material = j1Material;
    var mesh = new THREE.Mesh(stl, material);
    mesh.rotation.x = -0.5 * Math.PI;
    mesh.position.x = 500;
    scene.add(mesh);
  });
  stlloader.load("./models/workModels/j2.stl", function (stl) {
    var material = new THREE.MeshLambertMaterial({
      color: 0x7272ff,
    });
    var mesh = new THREE.Mesh(stl, material); //网格模型对象Mesh
    mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
    mesh.position.x = 500;
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
let j5Material = new THREE.MeshPhysicalMaterial({
  color: 0xf0ea2b,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  clearcoatNormalScale: 0.1,
});
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
  gltfloader.load(
    "./models/workModels/base.glb",
    function (glb) {
      // console.log("glb", glb);
      glb.scene.traverse((child) => {
        // console.log("child", child);
        if (child.isMesh) {
          child.material = baseMaterial;
        }
      });
      glb.scene.position.set(0, 0, 0);
      glb.scene.name = "base_model";
      base_model = glb.scene;
      // console.log(base_model);
      group.add(base_model);
    }
    // (error) => {
    //   console.error("加载模型出错:", error);
    // }
  );
  gltfloader.load("./models/workModels/j1.glb", function (glb) {
    // console.log("glb", glb);
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        // console.log(child);
        child.material = j1Material;
      }
    });
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

    // 先移动整个对象，再将单个模型移回原位，修改旋转点
    j2_model_group.position.y += 450;
    j2_model.position.y -= 450;

    j2_model_group.position.x += 75;
    j2_model.position.x -= 75;
    // 偏移X = -(box.min.x+ box.max.x) / 2
    // console.log(new THREE.Box3().setFromObject(j2_model_group.clone()));

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

    // j3_model_group.position.y -= 450;
    // j3_model_group.position.x -= 75;

    // j3_model_group.position.y += 1090;
    j3_model_group.position.y += 640;
    j3_model.position.y -= 1090;

    // j3_model_group.position.x += 75;
    j3_model.position.x -= 75;

    j3_model_group.add(j3_model.clone());
    j2_model_group.add(j3_model_group);
  });
  gltfloader.load("./models/workModels/j4.glb", function (glb) {
    // console.log("glb", glb);
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = j4Material;
      }
    });
    glb.scene.position.set(0, 0, 0);
    j4_model = glb.scene;
    glb.scene.name = "j4_model";

    // j4_model_group.position.y -= 1090;
    j4_model_group.position.x -= 75;

    // j4_model_group.position.y += 1285;
    j4_model_group.position.y += 195;
    j4_model.position.y -= 1285;

    j4_model_group.add(j4_model.clone());
    j3_model_group.add(j4_model_group);
  });
  gltfloader.load("./models/workModels/j5.glb", function (glb) {
    glb.scene.position.set(0, 0, 0);
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = j5Material;
      }
    });
    glb.scene.name = "j5_model";
    j5_model = glb.scene;

    // j5_model_group.position.y -= 1285;

    // j5_model_group.position.y += 1285;
    j5_model.position.y -= 1285;

    j5_model_group.position.x += 775;
    j5_model.position.x -= 775;

    j5_model_group.add(j5_model.clone());
    j4_model_group.add(j5_model_group);
  });
  gltfloader.load("./models/workModels/j6.glb", function (glb) {
    // console.log("glb", glb);
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = j6Material;
      }
    });
    glb.scene.name = "j6_model";
    j6_model = glb.scene;
    glb.scene.position.set(0, 0, 0);

    // j6_model_group.position.y -= 1285;
    j6_model_group.position.x -= 775;

    // j6_model_group.position.y += 1285;
    j6_model.position.y -= 1285;

    j6_model_group.add(j6_model.clone());
    j5_model_group.add(j6_model_group);
  });

  console.log("机械臂模型==>", group);
  group.castShadow = true;
  roboticArmModel = group;
  scene.add(group); //将对象组添加到场景当中
};

// GUI界面
const gui = new dat.GUI();
const initGuiBox = () => {
  const controlData = {
    color: "#ffffff",
    visible: true,
    x: 0,
    y: 0,
    z: 0,
    rotation: 0,
  };
  gui.domElement.id = "gui_box";
  gui.domElement.style.top = "00px";
  const base_folder = gui.addFolder("base");
  base_folder.addColor(controlData, "color").onChange((value) => {
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
  j2_folder.add(controlData, "rotation", -2, 2).onChange((value) => {
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

console.log("scene==>", scene);

// 点击模型事件
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
document.addEventListener("click", (event) => {
  // console.log(event);
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // const boundingRect = renderer.domElement.getBoundingClientRect();
  // console.log(testModels.value.getBoundingClientRect());
  // console.log(
  //   pointer.x, pointer.y,
  //   ((event.clientX - boundingRect.left) / boundingRect.width) * 2 - 1,
  //   -((event.clientY - boundingRect.top) / boundingRect.height) * 2 + 1
  // );

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera);
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children);
  // console.log(intersects);
  if (intersects.length > 0) {
    // 射线涉及到的物体集合
    // console.log(intersects[0].object);
    // intersects[0].object.scale.set(0.5, 0.5, 0.5);
    // intersects[0].object.material.wireframe = true;
    add_composer([intersects[0].object]);
  } else if (intersects.length === 0) {
    // 点击空白区域的时候就清除高亮效果
    add_composer([]);
  }
});

// 模型选中高亮 边缘高光
let composer;
let outlinePass;
let renderPass;
let effectFXAA;
let smaaPass;

// 模型高亮描边方法
const add_composer = (selectedObjects) => {
  // selectedObjects 点击的模型数据 []
  // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
  composer = new EffectComposer(renderer);

  // 新建一个场景通道  为了覆盖到原来的场景上
  renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // 物体边缘发光通道
  outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  );
  outlinePass.selectedObjects = selectedObjects;
  outlinePass.visibleEdgeColor.set(parseInt(0xfffbfb)); // 呼吸显示的颜色
  outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0); // 呼吸消失的颜色
  outlinePass.edgeStrength = 10.0; // 边框的亮度
  outlinePass.edgeGlow = 0.6; // 光晕[0,1]
  outlinePass.usePatternTexture = false; // 是否使用父级的材质
  outlinePass.edgeThickness = 1.0; // 边框宽度
  outlinePass.downSampleRatio = 1; // 边框弯曲度
  outlinePass.pulsePeriod = 5; // 呼吸闪烁的速度
  outlinePass.clear = true;
  composer.addPass(outlinePass);

  // 解决高亮后环境变暗的问题
  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // 自定义的着色器通道 作为参数
  effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms["resolution"].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  );
  effectFXAA.renderToScreen = true;
  composer.addPass(effectFXAA);

  // 抗锯齿
  smaaPass = new SMAAPass();
  composer.addPass(smaaPass);
};

//双击控制屏幕进入全屏, 退出全屏
window.addEventListener("dblclick", () => {
  // document.fullscreenElement; 进入全屏之后的canvans DOM元素
  const fullscreenElement = document.fullscreenElement;

  if (fullscreenElement) {
    //退出全屏, 使用document对象
    document.exitFullscreen();
  } else {
    //让画布对象全屏  此处renderer为three.js渲染器
    // renderer.domElement.requestFullscreen();
    // console.log(testModels.value);
    testModels.value.requestFullscreen();
  }
});

// rightClickMoveModel
const rightClickMoveModel = (event) => {
  // 用来记录鼠标的初始位置
  let mouseX0 = 0;
  let mouseY0 = 0;

  // 监听鼠标的contextmenu事件（右键点击）
  renderer.domElement.addEventListener("contextmenu", function (event) {
    event.preventDefault(); // 阻止默认的右键菜单弹出
    // console.log('1');
    // 记录鼠标的初始位置
    mouseX0 = event.clientX;
    mouseY0 = event.clientY;

    // 添加鼠标移动事件监听
    document.addEventListener("mousemove", onMouseMove, false);
    // 添加鼠标松开事件监听
    document.addEventListener("mouseup", onMouseUp, false);
  });

  // 鼠标移动事件处理函数
  function onMouseMove(event) {
    // 计算鼠标移动的距离
    const dx = event.clientX - mouseX0;
    const dy = event.clientY - mouseY0;

    // 根据鼠标移动的距离来更新摄像机的位置
    // 这里只是简单地将摄像机在x和z轴上进行平移
    // 你可能需要根据实际需求调整平移的逻辑
    camera.position.x -= dx * 10;
    camera.position.y += dy * 10;

    // 更新鼠标的当前位置
    mouseX0 = event.clientX;
    mouseY0 = event.clientY;
  }

  // 鼠标松开事件处理函数
  function onMouseUp(event) {
    // 移除鼠标移动事件监听
    document.removeEventListener("mousemove", onMouseMove, false);
    // 移除鼠标松开事件监听
    document.removeEventListener("mouseup", onMouseUp, false);
  }
};

// console.log(j1_model_group);
// const controls123 = new DragControls(j1_model_group, camera, renderer.domElement);

// controls123.addEventListener("dragstart", function (event) {
//   console.log(event);
//   event.j1_model_group.material.emissive.set(0xaaaaaa);
// });

// controls123.addEventListener("dragend", function (event) {
//   console.log(event);
//   event.j1_model_group.material.emissive.set(0x000000);
// });
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