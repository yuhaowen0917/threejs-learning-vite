<template>
  <div class="test-three" ref="testModels"></div>
  <!-- 模型加载进度条效果 v-show v-if -->
  <!-- <div
    style="position: absolute; left: 10%; bottom: 10%; z-index: 99; width: 20%"
  >
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="percentage"
    />
  </div> -->
</template>

<script setup>
import { ref, onMounted } from "vue";

import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from "three/addons/libs/stats.module.js";

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
camera.position.set(-5, 10, 12);
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
// scene.add(gridHelper);

const render = () => {
  stats.update();
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
  // 动画函数
  tick();
};

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，是控制器效果更真实，必须在动画循环里调用.update()
controls.enableDamping = false;
controls.dampingFactor = 0.01;
controls.update();

// 加入辅助轴，查看3维坐标轴
const axesHelper = new THREE.AxesHelper(4);
// axesHelper.position.y = 3;
scene.add(axesHelper);

// 环境光
const light = new THREE.AmbientLight(0x404040, 1); // 柔和的白光 color : 颜色, intensity : 光照强度
scene.add(light);

// 平行光
const directional_light = new THREE.DirectionalLight(0xffffff, 10);
directional_light.position.set(110, 110, 7);
scene.add(directional_light);

// 点光源
const point_light = new THREE.PointLight(0xffffff, 400, 100);
point_light.position.set(2, 5, 5);
point_light.castShadow = true;
scene.add(point_light);
// 添加灯光辅助
scene.add(new THREE.PointLightHelper(point_light, 1));

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
let mixer = null;

// 飞行器动画模型
const percentage = ref(0);
loader.load(
  "./models/glbModels/buster_drone.glb",
  (glb) => {
    // console.log("glb", glb);
    // 遍历模型中的物体
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        // console.log(child);
        if (child.name === "F_P7_leg_0") {
          child.material = new THREE.MeshLambertMaterial({
            color: 0xffff00,
          });
        }
      }
    });
    glb.scene.scale.set(1, 1, 1);
    glb.scene.position.set(0, 2, 0);

    mixer = new THREE.AnimationMixer(glb.scene);
    // 这个方法会返回一个AnimationAction
    const action = mixer.clipAction(glb.animations[0]);
    // 使用play()方法调用这个AnimationAction
    action.play();

    scene.add(glb.scene);
  },
  (xhr) => {
    // 加载进度
    const percent = xhr.loaded / xhr.total;
    // console.log("加载进度" + percent);
  }
);

// dragon
let mixer2 = null;
// loader.load(
//   "./models/glbModels/tarisland_dragon_poly.glb",
//   (glb) => {
//     console.log("dragon glb", glb);
//     // 遍历模型中的物体
//     // glb.scene.traverse((child) => {
//     //   if (child.isMesh) {
//     //     console.log(child);
//     //   }
//     // });
//     glb.scene.scale.set(0.1, 0.1, 0.1);
//     glb.scene.position.set(10, 0, 0);

//     mixer2 = new THREE.AnimationMixer(glb.scene);
//     // // 这个方法会返回一个AnimationAction
//     const action = mixer2.clipAction(glb.animations[4]);
//     // // 使用play()方法调用这个AnimationAction
//     action.play();
//     scene.add(glb.scene);

//     // 播放所有动画的方法
//     // const actions = glb.animations;
//     // actions.forEach(function (clip) {
//     //   // console.log(clip);
//     //   mixer2.clipAction(clip).play();
//     // });
//   },
//   (xhr) => {
//     // 加载进度
//     const percent = xhr.loaded / xhr.total;
//     percentage.value = Number((percent * 100).toFixed());
//     // console.log("加载进度" + percent);
//   }
// );

// 鳄鱼
let mixer1 = null;
// loader.load(
//   "./models/glbModels/low_poly_fox.glb",
//   (glb) => {
//     console.log("glb", glb);
//     // 遍历模型中的物体
//     // glb.scene.traverse((child) => {
//     //   if (child.isMesh) {
//     //     console.log(child);
//     //   }
//     // });
//     glb.scene.scale.set(0.1, 0.1, 0.1);
//     glb.scene.position.set(-15, 0, -1);
//     // glb.scene.rotation.y = 0.25 * Math.PI;

//     scene.add(glb.scene);

//     mixer1 = new THREE.AnimationMixer(glb.scene);
//     // 这个方法会返回一个AnimationAction
//     const action = mixer1.clipAction(glb.animations[0]);
//     // 使用play()方法调用这个AnimationAction
//     // action.play();
//   },
//   (xhr) => {
//     // 加载进度
//     const percent = xhr.loaded / xhr.total;
//     // console.log("加载进度" + percent);
//   }
// );

// 动画函数
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  // Update controls
  controls.update();
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update mixer
  if (mixer !== null) {
    mixer.update(deltaTime);
  }
  if (mixer1 !== null) {
    mixer1.update(deltaTime);
  }
  if (mixer2 !== null) {
    mixer2.update(deltaTime);
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
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
  // 射线涉及到的物体集合
  // console.log(intersects);
  if (intersects.length > 0) {
    // console.log(intersects[0].object.name);
    // intersects[0].object.position.x += 10;
    for (let i = 0; i < intersects.length; i++) {
      // intersects[i].object.material.color.set(0xff0000);
      // intersects[i].object.rotation.x += (10 * Math.PI) / 180;
      // intersects[i].object.position.x += 10;
      // intersects[i].object.position.add(vector);
    }
  }
});
</script>

<style lang="scss" scoped>
</style>