<template>
  <div ref="testModels" class="test-models"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

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
  camera.position.set(-2, 8, 12);
  camera.aspect = testModels.value.clientWidth / testModels.value.clientHeight;
  // 更新摄像头矩阵
  camera.updateProjectionMatrix();
  scene.add(camera);

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  // 设置渲染器的尺寸大小
  renderer.setSize(testModels.value.clientWidth, testModels.value.clientHeight);

  // 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
  window.addEventListener("resize", () => {
    console.log(testModels.value.clientWidth, testModels.value.clientHeight);
    camera.aspect =
      testModels.value.clientWidth / testModels.value.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      testModels.value.clientWidth,
      testModels.value.clientHeight
    );
    renderer.shadowMap.enabled = true;
  });

  // 创建轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);

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
};

const render = () => {
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
};

onMounted(() => {
  console.log(
    // document.querySelector(".test-models"),
    testModels.value,
    testModels.value.clientWidth,
    testModels.value.clientHeight
  );
  boxWidth.value = testModels.value.clientWidth;
  boxHeight.value = testModels.value.clientHeight;
  initThreeModels();
  testModels.value.appendChild(renderer.domElement);
  render();
  stlModels();
  initLight();
  stlModels_long();
  stlModels_book();

  observer = new ResizeObserver(handleResize);
  observer.observe(testModels.value);
});

let observer = null;
const change_width = ref("");
const change_height = ref("");
const handleResize = (entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    change_width.value = Number(width).toFixed();
    change_height.value = Number(height).toFixed();
    // console.log(
    //   `宽度：${Number(width).toFixed()}, 高度：${Number(height).toFixed()}`
    // );
    // 这里可以执行针对宽高变化的操作
    // 重新渲染
    // camera.aspect = change_width.value / change_height.value;
    // console.log('窗口', window.innerWidth, window.innerHeight)
    // camera.updateProjectionMatrix();
    // renderer.setSize(change_width.value.toString, change_height.value.toString)
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
    mesh.position.set(0, 8, 0);
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
    }); //材质对象Material
    var mesh = new THREE.Mesh(stl, material); //网格模型对象Mesh
    mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
    mesh.scale.set(0.05, 0.05, 0.05); //缩放
    mesh.position.set(0, 0, 0);
    // mesh.translateX(10);
    mesh.translateY(-20);
    mesh.translateZ(5);
    stl.center(); //居中显示
    scene.add(mesh);
  });
};

const stlModels_book = () => {
  stlloader.load(
    "./models/stlFormatModels/medieval_fantasy_book.stl",
    function (stl) {
      console.log("stl", stl);
      var material = new THREE.MeshLambertMaterial({
        color: 0x00ff00,
      }); //材质对象Material
      var mesh = new THREE.Mesh(stl, material); //网格模型对象Mesh
      mesh.rotation.x = -0.5 * Math.PI; //将模型摆正
      mesh.scale.set(0.1, 0.1, 0.1); //缩放
      mesh.position.set(-20, 10, 0);
      // mesh.translateX(10);
      stl.center(); //居中显示
      scene.add(mesh);
    }
  );
};

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
  const point_light = new THREE.PointLight(0xffffff, 400, 100);
  point_light.position.set(-30, 10, -10);
  point_light.castShadow = true;
  scene.add(point_light);

  // 添加灯光辅助
  scene.add(new THREE.PointLightHelper(point_light, 1));
};
</script>

<style lang="scss" scoped>
.test-models {
  width: 100%;
  height: 100%;
  border: 1px solid #ff2a2a;
}
</style>