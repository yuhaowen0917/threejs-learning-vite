<template>
  <div class="test-three" ref="vectorModule">
  </div>
</template>
  
<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const vectorModule = ref("");

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

// 创建立方体
const geometry = new THREE.BoxGeometry(2, 2, 2);
// const geometry = new THREE.SphereGeometry(3, 32, 16);
console.log(geometry);

// 创建基础网格材质
const material = new THREE.MeshBasicMaterial({
  color: 0xffff11,
});

// 创建三维向量
const vector = new THREE.Vector3(1, 1, 1);
console.log(vector);

// Mesh网格
const cube = new THREE.Mesh(geometry, material);
console.log(cube);
cube.position.set(1, 1, 1);
cube.position.add(vector); // 相加
// cube.position.x = 1;
cube.position.addScalar(1); // 相加
console.log("当前位置==>", cube.position.clone());

// 局部缩放
// cube.scale = new THREE.Vector3(2, 1, 1) //这种写法是错误的，属性是只读的
cube.scale.set(2, 3, 1);

// 平移
cube.translateX(1);

// 显示与隐藏
// cube.visible = true;

// 欧拉角 旋转变化 rotation
// cube.rotation.x = Math.PI / 4
// cube.rotation.set(Math.PI / 4, Math.PI / 2, Math.PI / 2)

// 分组
const cubeA = new THREE.Mesh(geometry, material);
cubeA.position.set(1, 1, -1);

const cubeB = new THREE.Mesh(geometry, material);
cubeB.position.set(-1, -1, 1);

//create a group and add the two cubes
//These cubes can now be rotated / scaled etc as a group
const group = new THREE.Group();
group.add(cubeA);
group.add(cubeB);
console.log(group);
group.position.y = 2

scene.add( group );

scene.add(cube);

// 添加网格地面
const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

const render = () => {
  // 渲染场景
  renderer.render(scene, camera);
  // 旋转变换
  cube.rotation.x += 0.01
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

// 挂载完毕之后获取dom
onMounted(() => {
  vectorModule.value.appendChild(renderer.domElement);
  render();
});
</script>
  
<style lang="scss">
</style>