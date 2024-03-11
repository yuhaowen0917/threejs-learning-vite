<template>
  <div ref="testModels" class="test-models"></div>
  <div class="btn-box">
    <button @click="moveAnimationFrame">相机移动</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
//引入性能监视器.js
import Stats from "three/addons/libs/stats.module.js";

import * as TWEEN from "@tweenjs/tween.js";

const testModels = ref("");
const boxWidth = ref("");
const boxHeight = ref("");

let scene;
let camera;
let renderer;
let controls;
let axesHelper;

const initThreeModels = () => {
  // 创建场景
  scene = new THREE.Scene();
  // 添加背景色
  scene.background = new THREE.Color(0x666666);

  // 初始化相机
  camera = new THREE.PerspectiveCamera(
    80,
    testModels.value.clientWidth / testModels.value.clientHeight,
    0.1,
    10000
  );
  // 初始化相机位置
  camera.position.set(1, 5, 30);
  camera.aspect = testModels.value.clientWidth / testModels.value.clientHeight;
  // 更新摄像头矩阵
  camera.updateProjectionMatrix();
  scene.add(camera);

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  // 设置渲染器的尺寸大小
  renderer.setSize(testModels.value.clientWidth, testModels.value.clientHeight);
  renderer.physicallyCorrectLights = true; //正确的物理灯光照射
  renderer.toneMapping = THREE.ACESFilmicToneMapping; //aces标准
  renderer.toneMappingExposure = 1.25; //色调映射曝光度
  renderer.shadowMap.enabled = true; //阴影就不用说了
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; //阴影类型（处理运用Shadow Map产生的阴影锯齿
  // 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
  window.addEventListener("resize", () => {
    // console.log(testModels.value.clientWidth, testModels.value.clientHeight);
    camera.aspect =
      testModels.value.clientWidth / testModels.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      testModels.value.clientWidth,
      testModels.value.clientHeight
    );
  });

  // 创建轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  // controls.target.set(0, 0, 0);
  // 设置控制器阻尼，是控制器效果更真实，必须在动画循环里调用.update()
  controls.enableDamping = false;
  controls.dampingFactor = 0.01;
  //是否开启右键拖拽
  // controls.enablePan = true;
  controls.update();

  // 加入辅助轴，帮助我们查看3维坐标轴
  // 6. 显示坐标轴(x轴: 红色; y轴: 绿色; z轴: 蓝色 rgb)
  // x轴水平方向(右正); y轴垂直方向(上正); z轴垂直xy平面即屏幕(外正)
  axesHelper = new THREE.AxesHelper(4);
  // axesHelper.position.y = 3;
  scene.add(axesHelper);

  // 创建立方体
  // const geometry = new THREE.BoxGeometry(2, 2, 2);
  // // 创建基础网格材质
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0xffff11,
  // });
  // // Mesh网格
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  // 添加网格地面
  const gridHelper = new THREE.GridHelper(40, 40);
  scene.add(gridHelper);
};

const render = () => {
  // stats.begin();
  // stats.end();
  stats.update();
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
  TWEEN.update();
  // if (shimo_meshl) {
  //   shimo_meshl.rotation.z += 0.01;
  //   // console.log(shimo_meshl.position.clone().y);
  //   if (shimo_meshl.position.clone().y < 10) {
  //     shimo_meshl.position.y += 0.01;
  //     // console.log(shimo_meshl.position.clone().y);
  //   } else {
  //     shimo_meshl.position.y = 2;
  //   }
  // }
};

var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
// 将stats的界面对应左上角
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "50px";
stats.domElement.style.top = "00px";

onMounted(() => {
  // console.log(
  //   testModels.value,
  //   testModels.value.clientWidth,
  //   testModels.value.clientHeight
  // );
  boxWidth.value = testModels.value.clientWidth;
  boxHeight.value = testModels.value.clientHeight;
  initThreeModels();
  testModels.value.appendChild(renderer.domElement);
  testModels.value.appendChild(stats.domElement);
  render();
  stlModels();
  initLight();
  stlModels_long();
  stlModels_book();
  // observer = new ResizeObserver(handleResize);
  // observer.observe(testModels.value);
});

let observer = null;
const change_width = ref("");
const change_height = ref("");
const handleResize = (entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    change_width.value = Number(width).toFixed();
    change_height.value = Number(height).toFixed();
    console.log(
      `宽度：${Number(width).toFixed()}, 高度：${Number(height).toFixed()}`
    );
    // 这里可以执行针对宽高变化的操作
    // 重新渲染
    camera.aspect =
      testModels.value.clientWidth / testModels.value.clientHeight;
    // console.log('窗口', window.innerWidth, window.innerHeight)
    // camera.updateProjectionMatrix();
    // renderer.setSize(testModels.value.clientWidth, testModels.value.clientHeight)
  }
};

// 测试到如一个stl格式的模型
const stlloader = new STLLoader();
const stlModels = () => {
  stlloader.load("./models/stlFormatModels/Cottage_FREE.stl", function (stl) {
    // console.log("stl", stl);
    var material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    }); //材质对象Material
    var mesh = new THREE.Mesh(stl, material); //网格模型对象Mesh
    mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
    mesh.scale.set(1, 1, 1); //缩放
    mesh.position.set(0, 5, 0);
    mesh.translateX(1);
    mesh.translateZ(1);
    stl.center(); //居中显示
    scene.add(mesh);
  });
};

const stlModels_long = () => {
  stlloader.load("./models/stlFormatModels/Dragon_Head.stl", function (stl) {
    // console.log("stl", stl);
    var material = new THREE.MeshPhysicalMaterial({
      color: 0xeee350,
      roughness: 0.6,
    }); //材质对象Material
    var mesh = new THREE.Mesh(stl, material); //网格模型对象Mesh
    mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
    mesh.rotation.z = Math.PI / 2;
    mesh.scale.set(0.01, 0.01, 0.01); //缩放
    mesh.position.set(-5.5, 0, 6);
    // mesh.translateX(10);
    mesh.translateY(-5);
    mesh.translateZ(3.6);
    stl.center(); //居中显
    scene.add(mesh);
  });
};

const stlModels_book = () => {
  stlloader.load(
    "./models/stlFormatModels/medieval_fantasy_book.stl",
    function (stl) {
      console.log("stl", stl);
      var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
      }); //材质对象Material
      var mesh = new THREE.Mesh(stl, material); //网格模型对象Mesh
      mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
      mesh.scale.set(0.1, 0.1, 0.1); //缩放
      mesh.position.set(-20, 5, 0);
      // mesh.translateX(10);
      stl.center(); //居中显示
      scene.add(mesh);
    }
  );
};

// 石魔
let shimo_meshl;
stlloader.load("./models/stlFormatModels/shimo.stl", function (stl) {
  // console.log("stl", stl);
  var material = new THREE.MeshLambertMaterial({
    color: 0x727272,
  }); //材质对象Material
  shimo_meshl = new THREE.Mesh(stl, material); //网格模型对象Mesh
  shimo_meshl.rotation.x = -0.5 * Math.PI; //将模型摆正
  shimo_meshl.scale.set(2, 2, 2); //缩放
  shimo_meshl.position.set(20, 2, 0);
  // mesh.translateX(10);
  stl.center(); //居中显示
  scene.add(shimo_meshl);
});

stlloader.load("./models/stlFormatModels/test01.stl", function (stl) {
  // console.log("stl", stl);
  var material = new THREE.MeshPhysicalMaterial({
    color: 0x727272,
    metalness: 1.0,
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  }); //材质对象Material
  var mesh = new THREE.Mesh(stl, material); //网格模型对象Mesh
  // mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
  mesh.scale.set(0.5, 0.5, 0.5); //缩放
  mesh.position.set(10, 10, 15);
  // 物体接收光源
  mesh.receiveShadow = true;
  // 物体投射光源
  mesh.castShadow = true;
  // mesh.translateX(10);
  stl.center(); //居中显示
  scene.add(mesh);
});

// 创建GLTF实例
const gltfloader = new GLTFLoader();
// 加载模型
gltfloader.load("./models/glbModels/medieval_fantasy_book.glb", function (glb) {
  // console.log("glb", glb);
  // 遍历模型中的物体
  glb.scene.traverse((child) => {
    // console.log(child);
  });
  glb.scene.scale.set(0.1, 0.1, 0.1);
  glb.scene.position.set(-20, 5, 10);

  scene.add(glb.scene);
});

// 灯光
const initLight = () => {
  // 环境光
  const light = new THREE.AmbientLight(0x404040, 1); // 柔和的白光 color : 颜色, intensity : 光照强度
  scene.add(light);

  // 平行光
  const directional_light = new THREE.DirectionalLight(0xffffff, 10);
  directional_light.position.set(10, 100, 7);
  scene.add(directional_light);

  // 点光源
  const point_light = new THREE.PointLight(0xfcf0f0, 400, 100);
  point_light.position.set(-30, 10, -10);
  point_light.castShadow = true;
  scene.add(point_light);

  const point_light1 = new THREE.PointLight(0xf0f0f0, 400, 100);
  point_light1.position.set(10, 10, 20);
  point_light1.castShadow = true;
  scene.add(point_light1);

  // 添加灯光辅助
  scene.add(new THREE.PointLightHelper(point_light, 1));
};

// 照相机移动效果
const vector = new THREE.Vector3(10, 10, 10);
const moveAnimationFrame = () => {
  camera.position.add(vector);
  console.log("当前位置==>", camera.position.clone());
  let position = { x: 2, y: 5, z: 8 };
  let tween = new TWEEN.Tween(camera.position).to(position, 3000);
  tween.onComplete(function () {
    controls.enabled = true;
  });
  tween.start();
  camera.lookAt(-1, 5, 12);
};
</script>

<style lang="scss" scoped>
.test-models {
  width: 100%;
  height: 100%;
  // border: 1px solid #ff2a2a;
}
.btn-box {
  position: absolute;
  bottom: 10%;
  left: 10%;
}
</style>