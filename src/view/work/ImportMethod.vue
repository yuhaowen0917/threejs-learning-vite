<template>
  <div class="test-three" ref="testModels">
    <div
      style="
        position: absolute;
        bottom: 10px;
        right: 40px;
        color: #ffffff;
        font-size: 12px;
        z-index: 1000;
      "
    >
      <div v-for="(item1, index1) in association_name" :key="index1">
        {{ item1 }}
        <div>
          设置关联
          <el-select
            v-model="tets_value"
            placeholder="Select"
            size="small"
            style="width: 150px"
            @change="(val) => selectChange(val, item1)"
          >
            <el-option
              v-for="(item, index) in association_name"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div style="display: flex">
          <span style="width: 25%">移动</span>
          <el-slider
            v-model="slider_value"
            :min="-400"
            :max="400"
            @input="(val) => moveSlider(val, item1)"
          />
        </div>
        <div style="display: flex">
          <span style="width: 25%">旋转</span>
          <el-slider
            v-model="rotate_value"
            :min="-10"
            :max="10"
            @input="(val) => rotateModel(val, item1)"
          />
        </div>
        <div style="display: flex" class="rotate-center">
          <span>
            <el-input v-model="x_position" placeholder="x" />
          </span>
          <span>
            <el-input v-model="y_position" placeholder="y" />
          </span>
          <span>
            <el-input v-model="z_position" placeholder="z" />
          </span>
          <span @click="debugRotateCenter(item1)">确定</span>
        </div>
      </div>
      <!-- <div>{{ treeModels_array }}</div> -->
    </div>
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
const slider_value = ref(0);
const rotate_value = ref(0);

const x_position = ref(0);
const y_position = ref(0);
const z_position = ref(0);

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
};

console.log("scene==>", scene);

/**
 * 关联嵌套模型的方法 将模型一层层嵌套添加到上一个模型关节的children中
 * 手动添加模型分组，添加后再将原本整体模型中的组件数据删除
 * @param value {string} 选择 被 关联模型的 name 值
 * @param item {string} 需要关联的模型的值, models 去关联绑定 name； 在被关联后就无法再次被点击关联
 */
const NestedChildren = (value, item) => {
  // console.log(value, item);
  let models; // 被关联的模型
  let models1; // 寻求关联的模型
  // 遍历所有子模型，不管多少层 获取到需要去关联的模型
  roboticArmModel.traverse((child) => {
    if (child instanceof THREE.Group && child.name === value) {
      // console.log(child);
      models = child;
      return;
    }
  });
  roboticArmModel.traverse((child) => {
    if (child instanceof THREE.Group && child.name === item) {
      models1 = child;
      return;
    }
  });
  if (models && models1) {
    // 关联模型创建一个分组对象
    const model_group = new THREE.Object3D();
    model_group.name = item + "_group";
    model_group.add(models1.clone());
    const parent = models1.parent;

    // 被关联模型创建一个分组对象
    const model_group1 = new THREE.Object3D();
    model_group1.name = value + "_group";
    model_group1.add(models.clone());
    model_group1.add(model_group);
    const parent1 = models.parent; // 被关联模型的父对象

    console.log(parent.name, parent1.name);
    if (parent1.name === value + "_group") {
      // 已存在被关联模型组件的分组对象，无需再次创建，直接导入需求关联的模型
      // console.log("已存在被关联模型组件的分组对象");
      parent1.add(model_group);
      parent.remove(models1);
      // parent1.remove(models);
    } else if (parent.name === item + "_group") {
      /* 
        进行一种情况的判断，当object3D原本是存在的，此次修改只是切换关联对象，
        只删除了原本的Group 但是未删除 object3D ，留下个空壳子,
        要清除干净，不留痕迹
        还得携带着原本关联的对象一起切换，拖家带口
      */
      const parent_parent = parent.parent;
      // console.log("切换关联对象", parent_parent);
      let move_model;
      roboticArmModel.traverse((child) => {
        if (child instanceof THREE.Object3D && child.name === parent.name) {
          move_model = child;
          return;
        }
      });
      // console.log(move_model, parent.name, models.name, model_group1);
      parent_parent.remove(parent);
      model_group1.add(move_model);
      parent1.add(model_group1.remove(model_group)); // 加入的应该是原本的 object3D 无需新建，迁移
      parent1.remove(models);
      // console.log(move_model, model_group1.remove(model_group));
    } else {
      parent1.add(model_group1);
      parent.remove(models1);
      parent1.remove(models);
    }
  }

  // console.log(models, models1, roboticArmModel);
  console.log(roboticArmModel);

  // 选项列表
  association_name.value = [];
  // 遍历所有子对象无论多少层 Group 和 Object3D 都有
  roboticArmModel.traverse(function (child) {
    if (child instanceof THREE.Group && child.name !== "robotic-arm") {
      association_name.value.push(child.name);
      // console.log(child.name);
    }
  });
};

// 下拉框选中值
const selectChange = (value, item) => {
  // console.log(value, item); // value 选中值 item 类别
  console.log(item + "去关联" + value);
  // 只能遍历一层
  // let models_data = roboticArmModel.children.filter((child) => {
  //   if (!child.isMesh && child.name === item) {
  //     return child;
  //   }
  // });
  // // console.log(value, models_data[0]);
  // NestedChildren(value, models_data[0]);

  if (value === item) {
    console.log("自己无法关联自己", value, item);
  } else {
    NestedChildren(value, item);
  }
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

// 移动滑块
const moveSlider = (val, item) => {
  // console.log(val, item);
  let model;
  roboticArmModel.traverse((child) => {
    if (child instanceof THREE.Group && child.name === item) {
      // console.log(child);
      model = child;
      return;
    }
  });
  // 判断父级对象是否是分组的,是的话，移动整个分组；不是则移动单个模型组件
  if (model.parent.name === item + "_group") {
    model.parent.position.x = val;
    // .translateX() .rotateX ()
  } else {
    model.position.x = val;
  }
  // console.log(model, model.parent.name);
};

// 模型旋转
const rotateModel = (val, item) => {
  // console.log(val, item);
  let model;
  roboticArmModel.traverse((child) => {
    if (child instanceof THREE.Group && child.name === item) {
      model = child;
      return;
    }
  });
  // 判断父级对象是否是分组的,是的话，旋转整个分组；不是则旋转单个模型组件
  if (model.parent.name === item + "_group") {
    model.parent.rotateZ(val);
  } else {
    model.rotateZ(val);
  }
};

/**
 * 设置模型组件的旋转中心，如果有 Object3D 分组，则是对分组的位置进行修改调整，设置旋转中心
 * @param item {string} 选中的模型 name
 */
const debugRotateCenter = (item) => {
  console.log(x_position.value, y_position.value, z_position.value, item);
  let x_move, y_move, z_move;
  x_move = Number(x_position.value);
  y_move = Number(y_position.value);
  z_move = Number(z_position.value);
  let rotate_model;
  roboticArmModel.traverse((child) => {
    if (child instanceof THREE.Group && child.name === item) {
      // console.log(child);
      rotate_model = child;
      return;
    }
  });
  // 判断父级分组
  let parent_model;
  if (rotate_model.parent) {
    parent_model = rotate_model.parent;
    console.log(rotate_model, parent_model);
    if (parent_model.name === item + "_group") {
      console.log(
        "修改分组的位置",
        rotate_model.position,
        parent_model.position
      );
      parent_model.position.x += x_move;
      parent_model.position.y += y_move;
      parent_model.position.z += z_move;

      rotate_model.position.x -= x_move;
      rotate_model.position.y -= y_move;
      rotate_model.position.z -= z_move;
      console.log(roboticArmModel);
    } else {
      console.log(
        "修改模型的位置",
        rotate_model.position,
        parent_model.position
      );
    }
  }
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
.test-three {
  .el-slider {
    height: 20px;
    .el-slider__button-wrapper {
      width: 20px;
      height: 20px;
      top: -8px;
      .el-slider__button {
        width: 15px;
        height: 15px;
      }
    }
  }
  .rotate-center {
    justify-content: space-around;
    .el-input {
      width: 45px;
      .el-input__wrapper {
        padding: 0;
        input {
          text-align: center;
          height: 22px;
        }
      }
    }
  }
}
</style>