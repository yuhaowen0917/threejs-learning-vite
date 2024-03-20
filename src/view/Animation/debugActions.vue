<template>
  <div class="test-three" ref="testModels"></div>
  <div class="btn-box">
    <button @click="event">相机移动</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
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
  // moveAnimationFrame();
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
camera.position.set(-5, 10, 15);
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
// const gridHelper = new THREE.GridHelper(40, 40);
// scene.add(gridHelper);

const render = () => {
  stats.update();
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
  // 动画函数
  tick();
  // 动画更新
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
const axesHelper = new THREE.AxesHelper(4);
// axesHelper.position.y = 3;
scene.add(axesHelper);

// 环境光
const light = new THREE.AmbientLight(0x404040, 100); // 柔和的白光 color : 颜色, intensity : 光照强度
scene.add(light);

// 平行光
const directional_light = new THREE.DirectionalLight(0xffffff, 10);
directional_light.position.set(110, 110, 7);
scene.add(directional_light);

// 点光源
const point_light = new THREE.PointLight(0xffffff, 400, 100);
point_light.position.set(-5, 5, -2);
point_light.castShadow = true;
scene.add(point_light);

// 添加灯光辅助
// scene.add(new THREE.PointLightHelper(point_light, 1));

// 材质
const material = new THREE.MeshPhysicalMaterial({
  //   color: 0x727272,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
});

// 创建GLTF实例
const loader = new GLTFLoader();
// 加载模型
// 飞行器动画模型
const percentage = ref(0);
let glt_model;
let glt_model_child;
loader.load(
  "./models/robotic_arm/robotic_arm.glb",
  (glb) => {
    console.log("glb", glb);

    glt_model = glb.scene;
    glt_model.scale.set(0.5, 0.5, 0.5);
    glt_model.position.set(5, 0, 0);
    glt_model.rotation.y = Math.PI / 4;

    // 遍历模型中的物体
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        // console.log("child==>", child);
        if (child.name === "_polySurface260_Base_Del_0") {
          glt_model_child = child;
          console.log(glt_model_child);
          child.material = new THREE.MeshPhongMaterial({
            color: 0xffff00,
            shininess: 1000,
          });
        }
        if (child.name === "_curve15polySurface246_Base_Del_0") {
          child.material = new THREE.MeshLambertMaterial({
            color: 0xfaafbb,
          });
        }
        if (child.name === "_curve15polySurface247_Base_Del_0") {
          child.material = new THREE.MeshLambertMaterial({
            color: 0x0aafbb,
          });
        }
        if (child.name === "polySurface654_Base_Del_0") {
          console.log(child.material);
          child.material = new THREE.MeshPhysicalMaterial({
            color: 0x00ff00,
            metalness: 1.0,
            roughness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            // clearcoatNormalScale: 0.1
          });
        }
      }
    });
    // tweenAnimation(glb.scene);

    scene.add(glb.scene);
  },
  (xhr) => {
    // 加载进度
    // const percent = xhr.loaded / xhr.total;
    // percentage.value = Number((percent * 100).toFixed());
    // console.log("加载进度" + percent);
  }
);

/**
 * 启动特定网格对象的动画。在三维模型的动画数组中按名称查找动画
 * @param skinnedMesh {THREE.SkinnedMesh} 要设置动画的网格
 * @param animations {Array} 数组，包含此模型的所有动画
 * @param animationName {string} 要启动的动画的名称
 * @return {THREE.AnimationMixer} 要在渲染循环中使用的混合器
 */
function startAnimation(skinnedMesh, animations, animationName) {
  const m_mixer = new THREE.AnimationMixer(skinnedMesh);
  const clip = THREE.AnimationClip.findByName(animations, animationName);
  if (clip) {
    const action = m_mixer.clipAction(clip);
    action.play();
  }
  return m_mixer;
}

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
    console.log(intersects[0].object.name);
    // intersects[0].object.rotation.x += (10 * Math.PI) / 180;
    // Drone_Turb_M_L_body_0
    // for (let i = 0; i < intersects.length; i++) {
    //   intersects[i].object.material.color.set(0xff0000);
    //   intersects[i].object.rotation.x += (10 * Math.PI) / 180;
    //   intersects[i].object.position.x += 10;
    //   intersects[i].object.position.add(vector);
    // }
  }
});

let i = 1;
const moveAnimationFrame = () => {
  // 运动完轨迹
  // console.log(glt_model.position.clone());
  // if (i <= points.length) {
  //   let tween = new TWEEN.Tween(glt_model.position)
  //     .to(points[i], 200) // 在 8 秒内移动到 position
  //     .easing(TWEEN.Easing.Linear.None) // 使用缓动函数使动画流畅。;
  //     .start();
  //   // tween.onStop(() => {
  //   //   console.log(glt_model.position.clone());
  //   // });
  //   tween.onComplete(function () {
  //     // console.log(glt_model.position.clone());
  //     moveAnimationFrame();
  //     i++;
  //   });
  // } else {
  //   i = 0;
  //   moveAnimationFrame();
  // }

  // 重复执行
  // let tween = new TWEEN.Tween(glt_model.position)
  //   .to({ x: 10, y: 5, z: 10 }, 8000) // 在 8 秒内移动到 position
  //   .easing(TWEEN.Easing.Linear.None) // 使用缓动函数使动画流畅。;
  //   .delay(1000) // 1s后执行动画，
  //   .repeatDelay(500)
  //   .repeat(10) // 重复10次 .repeat(Infinity) 重复无限次
  //   .start();
  // tween.onComplete(function () {
  //   controls.enabled = true;
  // });

  // 往返执行 链接两个动画
  let tweenA = new TWEEN.Tween(glt_model.position)
    .to({ x: 10, y: 2, z: 10 }, 7000) // 在 8 秒内移动到 position
    .easing(TWEEN.Easing.Linear.None) // 使用缓动函数使动画流畅。;
    .start();
  tweenA.onComplete(function () {
    // console.log(glt_model.position);
    // glt_model.rotation.x = Math.PI / 2; //将模型摆正
  });
  let tweenRot1 = new TWEEN.Tween({ rotZ: glt_model.rotation.z }).to(
    { rotZ: Math.PI * 2 },
    1000
  ); // 设置旋转动画内容， 0.4s
  // 在tween每次被更新后执行，实际操作
  tweenRot1.onUpdate(function (object, elapsed) {
    // console.log(glt_model.rotation.y, object, elapsed);
    glt_model.rotation.z = object.rotZ;
  });
  let tweenB = new TWEEN.Tween(glt_model.position)
    .to({ x: -10, y: 2, z: 0 }, 5000) // 在 8 秒内移动到 position
    .easing(TWEEN.Easing.Quadratic.InOut); // 使用缓动函数使动画流畅。;
  // 链接多个动画
  tweenA.chain(tweenRot1);
  tweenRot1.chain(tweenB);
  tweenB.chain(tweenA);
};

const isFootVisible = ref(true);
const event = () => {
  isFootVisible.value = !isFootVisible.value;
  // glt_model_child.material.visible = isFootVisible.value;
};

// GUI界面
const controlData = {
  bgcolor: "#666666",
  x: 0,
  y: 0,
  z: 0,
  rotation: 0,
  visible: true,
};
const gui = new dat.GUI();
gui.domElement.id = "gui_box";
const folder = gui.addFolder("配置");
folder.addColor(controlData, "bgcolor").onFinishChange((value) => {
  // console.log("停止修改之后，最终确定的值：", value);
  scene.background = new THREE.Color(value);
});
folder.add(controlData, "x", -10, 10).onChange((value) => {
  glt_model.position.x = value;
});
folder.add(controlData, "y", -10, 10).onChange((value) => {
  glt_model.position.y = value;
});
folder.add(controlData, "z", -10, 10).onChange((value) => {
  glt_model.position.z = value;
});
folder.add(controlData, "rotation", -10, 10).onChange((value) => {
  glt_model.rotation.y = value;
});
folder.add(controlData, "visible").name("某一组件是否显示");

folder.open();

// 移动动画效果
const tweenAnimation = (model) => {
  let childModel_1;
  model.traverse((child) => {
    if (child.isMesh) {
      // console.log(child);
      if (child.name === "polySurface654_Base_Del_0") {
        childModel_1 = child;
        console.log(childModel_1);
      }
    }
  });
  // 动画效果
  let tweenA = new TWEEN.Tween(model.position)
    .to({ x: 15, y: 0, z: 0 }, 7000) // 在 8 秒内移动到 position
    .easing(TWEEN.Easing.Linear.None) // 使用缓动函数使动画流畅。;
    .start();
  tweenA.onComplete(function () {
    // glt_model.rotation.x = Math.PI / 2; //将模型摆正
  });
  tweenA.onUpdate(function (object, elapsed) {
    // console.log(object);
    glt_model.rotation.y = object.x;
    // childModel_1.rotation.x  = object.x;
    // childModel_1.rotateX(object.x);
  });
  let tweenB = new TWEEN.Tween(model.position)
    .to({ x: 5, y: 0, z: 0 }, 7000)
    .easing(TWEEN.Easing.Cubic.Out); // 使用缓动函数使动画流畅。;
  let tweenC = new TWEEN.Tween(model.position)
    .to({ x: 5, y: 0, z: 0 }, 7000)
    .easing(TWEEN.Easing.Linear.None);
  tweenC.onUpdate(function (object, elapsed) {
    // console.log(object);
    glt_model.rotateY(Math.PI / 60);
  });
  // 链接多个动画
  tweenA.chain(tweenB);
  tweenB.chain(tweenC);
  tweenC.chain(tweenA);
};
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