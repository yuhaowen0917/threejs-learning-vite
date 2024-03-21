<template>
  <div class="test-three" ref="testModels"></div>
  <div style="position: absolute; bottom: 80px; right: 50px; color: #ffffff">
    <div v-for="item1 in association_name" :key="item1">
      {{ item1 }}
      <div>
        设置关联
        <el-select
          v-model="tets_value"
          placeholder="Select"
          size="small"
          style="width: 200px"
          @change="(val) => selectChange(val, item1)"
        >
          <el-option
            v-for="item in association_name"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
    <div>{{ treeModels_array }}</div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, reactive } from "vue";

import * as THREE from "three";
// 轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import Stats from "three/addons/libs/stats.module.js";

// import * as TWEEN from "@tweenjs/tween.js";
// 导入动画库
// import gsap from "gsap";

// 导入 dat.gui
import * as dat from "dat.gui";

const tets_value = ref("");

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
  testModels.value.appendChild(gui.domElement);

  GtlModelsMethods();

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

// 创建地面
const ground = new THREE.PlaneGeometry(3000, 2000); // 模型
const ground_material = new THREE.MeshPhongMaterial({
  color: 0x484848,
  shininess: 100,
  side: THREE.DoubleSide, // 允许平面几何体双面渲染
});
const ground_cube = new THREE.Mesh(ground, ground_material); // 网格
ground_cube.rotation.x -= Math.PI / 2;
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
  // TWEEN.update();
};

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，是控制器效果更真实，必须在动画循环里调用.update()
controls.enableDamping = false;
controls.dampingFactor = 0.01;
controls.enablePan = true; // 启用或禁用摄像机平移，默认为true
controls.enableRotate = true; // 启用或禁用摄像机水平或垂直旋转。默认值为true
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

// 创建GLTF实例
let baseMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x2e2e2e,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  clearcoatNormalScale: 0.1,
});
let j1Material = new THREE.MeshPhysicalMaterial({
  color: 0x00ff00,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  // clearcoatNormalScale: 0.1
});
let j2Material = new THREE.MeshPhongMaterial({
  color: 0xcd39cd,
  shininess: 1000,
});
let j3Material = new THREE.MeshPhysicalMaterial({
  color: 0xdd0d0d,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  clearcoatNormalScale: 0.1,
});
let j4Material = new THREE.MeshPhysicalMaterial({
  color: 0xffeeff,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  clearcoatNormalScale: 0.1,
});
let j5Material = new THREE.MeshPhysicalMaterial({
  color: 0xf0ea2b,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05,
  clearcoatNormalScale: 0.1,
});
let j6Material = new THREE.MeshStandardMaterial({
  color: 0x2e2e2e,
});
let roboticArmModel; // 整体模型

const gltModelsList = [
  {
    name: "base_model",
    path: "./models/workModels/base.glb",
    material: baseMaterial,
  },
  {
    name: "j1_model",
    path: "./models/workModels/j1.glb",
    material: j1Material,
  },
  {
    name: "j2_model",
    path: "./models/workModels/j2.glb",
    material: j2Material,
  },
  {
    name: "j3_model",
    path: "./models/workModels/j3.glb",
    material: j3Material,
  },
  {
    name: "j4_model",
    path: "./models/workModels/j4.glb",
    material: j4Material,
  },
  {
    name: "j5_model",
    path: "./models/workModels/j5.glb",
    material: j5Material,
  },
  {
    name: "j6_model",
    path: "./models/workModels/j6.glb",
    material: j6Material,
  },
];

const GtlModelsMethods = () => {
  gltModelsList.forEach((item) => {
    // console.log(item);
    initGtlModels_new(item.name, item.path, item.material);
  });
};

const gltfloader = new GLTFLoader();
const group = new THREE.Group(); //实例化一个THREE.Object3D对象
group.name = "robotic-arm";
/**
 * 通过获取到的模型数据，直接导入渲染模型
 * @param name {string} 模型组件的命名
 * @param path {string} 导入的模型文件路径
 * @param material {THREE.MeshPhysicalMaterial} 模型组件材质
 * @return {glb} 导入后模型的数据信息
 */
const initGtlModels_new = (name, path, material) => {
  gltfloader.load(
    path,
    function (glb) {
      glb.scene.traverse((child) => {
        // console.log("child", child);
        if (child.isMesh) {
          child.material = material;
        }
      });
      glb.scene.position.set(0, 0, 0);
      glb.scene.name = name;
      group.add(glb.scene);
    }
    // (xhr) => {
    //   // 加载进度
    //   const percent = xhr.loaded / xhr.total;
    //   console.log(name + "加载进度" + percent);
    // }
  );
  // console.log("机械臂模型==>", group);
  group.castShadow = true;
  roboticArmModel = group;
  // console.log(scene);
  scene.add(group);
  treeModelsData(group.children);
};

// GUI界面
const gui = new dat.GUI();
let association_name = ref([]);
const initGuiBox = () => {
  const controlData = {
    color: "#ffffff",
    visible: true,
    x: 0,
    y: 0,
    z: 0,
    rotation: 0,
    association: "",
  };
  association_name.value = gltModelsList.map((item) => item.name);
  gui.close();
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
  base_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
    roboticArmModel.rotation.y = value;
  });
  base_folder.add(controlData, "x", -400, 400).onChange((value) => {
    roboticArmModel.position.x = value;
  });
  base_folder
    .add(controlData, "association", association_name.value)
    .name("关联层级")
    .onChange(function (value) {
      console.log(value);
    });
  // base_folder.open();
  const j1_folder = gui.addFolder("j1");
  // j1_folder.open();
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
  j1_folder
    .add(controlData, "association", association_name.value)
    .name("关联层级")
    .onChange(function (value) {
      let models_data = roboticArmModel.children.filter((child) => {
        if (!child.isMesh && child.name === "j1_model") {
          return child;
        }
      });
      NestedChildren(value, models_data[0]);
    });
  const j2_folder = gui.addFolder("j2");
  // j2_folder.open();
  j2_folder.addColor(controlData, "color").onChange((value) => {
    j2Material.color.set(value);
  });
  j2_folder
    .add(controlData, "visible")
    .name("visible")
    .onFinishChange((value) => {
      // j2_model_group.children[0].visible = value;
      console.log(j2_model_group);
    });
  j2_folder.add(controlData, "rotation", -2, 2).onChange((value) => {
    j2_model_group.rotation.z = value;
  });
  j2_folder
    .add(controlData, "association", association_name.value)
    .name("关联层级")
    .onChange(function (value) {
      let models_data = roboticArmModel.children.filter((child) => {
        if (!child.isMesh && child.name === "j2_model") {
          return child;
        }
      });
      // console.log(value, models_data[0]);
      NestedChildren(value, models_data[0]);
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
  j3_folder
    .add(controlData, "association", association_name.value)
    .name("关联层级")
    .onChange(function (value) {
      let models_data = roboticArmModel.children.filter((child) => {
        if (!child.isMesh && child.name === "j3_model") {
          return child;
        }
      });
      // console.log(models_data[0]);
      NestedChildren(value, models_data[0]);
    });
  // // j3_folder.open();
  // const j4_folder = gui.addFolder("j4");
  // j4_folder.addColor(controlData, "color").onChange((value) => {
  //   j4Material.color.set(value);
  // });
  // j4_folder
  //   .add(controlData, "visible")
  //   .name("visible")
  //   .onFinishChange((value) => {
  //     j4_model_group.children[0].visible = value;
  //   });
  // j4_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
  //   j4_model_group.rotation.x = value;
  // });
  // const j5_folder = gui.addFolder("j5");
  // j5_folder.addColor(controlData, "color").onChange((value) => {
  //   j5Material.color.set(value);
  // });
  // j5_folder
  //   .add(controlData, "visible")
  //   .name("visible")
  //   .onFinishChange((value) => {
  //     j5_model_group.children[0].visible = value;
  //   });
  // j5_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
  //   j5_model_group.rotation.z = value;
  // });
  // const j6_folder = gui.addFolder("j6");
  // j6_folder.addColor(controlData, "color").onChange((value) => {
  //   j6Material.color.set(value);
  // });
  // j6_folder
  //   .add(controlData, "visible")
  //   .name("visible")
  //   .onFinishChange((value) => {
  //     j6_model_group.children[0].visible = value;
  //   });
  // j6_folder.add(controlData, "rotation", -10, 10).onChange((value) => {
  //   j6_model_group.rotation.x = value;
  // });
};

console.log("scene==>", scene);

/**
 * 关联嵌套模型的方法 将模型一层层嵌套添加到上一个模型关节的children中
 * 手动添加模型分组，添加后再将原本整体模型中的组件数据删除
 * @param name {string} 选择关联模型的 name 值
 * @param models {THREE.Group} 需要关联的模型的值, models 去关联绑定 name 在被关联后就无法再次被点击关联
 */
const NestedChildren = (name, models) => {
  if (models && name !== models.name) {
    roboticArmModel.children.forEach((item) => {
      console.log(item.type, models.type);
      if (item.name === name) {
        console.log(name, models);

        // 关联模型创建一个分组对象
        const model_group = new THREE.Object3D();
        model_group.name = models.name + "_group";
        model_group.add(models.clone());

        // 被关联模型创建一个分组对象
        const model_group1 = new THREE.Object3D();
        model_group1.name = name + "_group";
        model_group1.add(item.clone());
        model_group1.add(model_group);

        // item.position.x = 500;
        roboticArmModel.add(model_group1);
        roboticArmModel.remove(models); // 清除原本的模型group对象
        roboticArmModel.remove(item); // 清除被关联模型group对象

        // const new_association_name = association_name.value.filter(
        //   (item) => item !== models.name
        // );
        // association_name.value = new_association_name;

        console.log(roboticArmModel);

        // 更新下拉框列表
        association_name.value = [];
        roboticArmModel.children.forEach((item) => {
          association_name.value.push(item.name);
          // console.log(item.type);
        });
      }
      // 判断group分组是否已存在
    });
  } else {
    console.log("自己无法关联自己", name, models);
  }
};

// 下拉框选中值
const selectChange = (value, item) => {
  // console.log(value, item); // value 选中值 item 类别
  console.log(item + "去关联" + value);
  let models_data = roboticArmModel.children.filter((child) => {
    if (!child.isMesh && child.name === item) {
      return child;
    }
  });
  // console.log(value, models_data[0]);
  NestedChildren(value, models_data[0]);
};

// 设置树形模型数据
const treeModels_array = ref([]);
const treeModelsData = (val) => {
  // console.log(val.length);
  // val.children.forEach((item) => {
  //   treeModels_array.value.push(item.name);
  //   console.log(item);
  // });
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