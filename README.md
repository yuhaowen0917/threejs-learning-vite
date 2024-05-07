# Vue 3 + Vite

在 Vue 中，直接使用 addEventListener 来监听元素宽高变化并不简单，因为原生的 DOM 事件并不包括元素的尺寸变化。但是，你可以使用一种称为“Resize Observer”的 API 来实现这个功能。

Resize Observer 是一个能够异步观察元素尺寸变化的接口。如果元素的大小发生变化，则会通知你。

以下是如何在 Vue 组件中使用 Resize Observer 的示例：

```javascript
<template>
  <div ref="myElement">
    <!-- Your content here -->
  </div>
</template>

<script>
export default {
  mounted() {
    this.observeResize();
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    observeResize() {
      const element = this.$refs.myElement;
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          console.log(entry.contentRect); // 这里你可以获取到元素的尺寸信息
          // 在这里你可以添加你自己的逻辑，比如更新 Vue 的数据等
        }
      });
      this.resizeObserver.observe(element);
    },
  },
};
</script>
```

### 模型点击事件，通过光射线.Raycaster()

```javascript
// 点击模型事件
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
document.addEventListener("click", (event) => {
  // console.log(event);
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  console.log(pointer);
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera);
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children);
  // 射线涉及到的物体集合
  // console.log(intersects);
  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      intersects[0].object.material.color.set(0xff0000);
    }
  }
});
```

### 机械臂连杆运动逻辑 连动 牵一发而动全身

将所有子模型合并在一个对象中 或者一个分组内
将连动的模型也可以合并在一起

```javascript
// 模型分组嵌套 错误代码
const ModelsNested = () => {
  const part = new THREE.Mesh(j1_model); // // 将 new THREE.Mesh(j1_model) 改为 j1_model.clone()，
  const part1 = new THREE.Mesh(new THREE.BoxGeometry(200, 20, 400));
  const part2 = new THREE.Mesh(new THREE.BoxGeometry(500, 755, 400));
  part1.position.x = 500;
  part2.position.x = -500;
  j1_model_group.add(part).add(part1).add(part2);
  groupModels.add(j1_model_group);
  console.log(j1_model_group);
};
```

### 选中模型的高亮效果

参考文章

[hreejs 点击模型实现模型边缘高亮的选中效果](https://juejin.cn/post/7264780458738778153)

[threejs 单击选中模型高亮显示/选中模型发光](https://blog.csdn.net/qq_15023917/article/details/114366480)

[threeJS 鼠标单击模型边缘高亮](https://blog.csdn.net/mmiaoChong/article/details/113751254)

```javascript
// 导入所需要的插件 后期处理效果
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
// import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
// import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

// 模型选中高亮 边缘高光
let composer;
let outlinePass;
let renderPass;
let effectFXAA;
let smaaPass;

add_composer([intersects[0].object]); // 用数组括号包裹

const add_composer = (selectedObjects) => {
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
  outlinePass.visibleEdgeColor.set(parseInt(0xfff010)); // 呼吸显示的颜色
  outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0); // 呼吸消失的颜色
  outlinePass.edgeStrength = 10.0; // 边框的亮度
  outlinePass.edgeGlow = 1; // 光晕[0,1]
  outlinePass.usePatternTexture = false; // 是否使用父级的材质
  outlinePass.edgeThickness = 1.0; // 边框宽度
  outlinePass.downSampleRatio = 1; // 边框弯曲度
  outlinePass.pulsePeriod = 5; // 呼吸闪烁的速度
  outlinePass.selectedObjects = selectedObjects;
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
  composer.addPass(effectFXAA);

  // 抗锯齿
  smaaPass = new SMAAPass();
  composer.addPass(smaaPass);
};
```

### 修改模型对象旋转中心

参考文章

[Tweenjs 动画实例~](https://juejin.cn/post/7119016773730435086#heading-10)

[Three.js 改变模型对象的旋转轴位置](http://www.yanhuangxueyuan.com/doc/Three.js/translateAxis.html)

模型对象嵌套一个父对象，然后把该模型对象相对于父对象平移一定距离

先移动整个对象分组，再将单个模型移回原位，修改旋转点

```javascript
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

  j3_model_group.position.y -= 450;
  j3_model_group.position.x -= 75;

  j3_model_group.position.y += 1090;
  j3_model.position.y -= 1090;

  j3_model_group.position.x += 75;
  j3_model.position.x -= 75;

  j3_model_group.add(j3_model.clone());
  j2_model_group.add(j3_model_group);
});
```

### Three.js 作为组件引入并使用时，模型点击坐标点偏差

当将 Three.js 作为组件引入并使用时，由于组件内部可能存在自定义的 DOM 结构或样式，以及可能存在事件冒泡或事件捕获等问题，导致你在计算鼠标位置时出现偏差。

一种解决方法是将事件监听添加到 Three.js 组件自身的 DOM 元素上，以确保事件处理程序能够正确捕获鼠标点击事件并计算正确的鼠标位置。下面是一个可能的修改方法：

```javascript
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const canvas = document.getElementById("testThree");
canvas.addEventListener("click", (event) => {
  // const boundingRect = renderer.domElement.getBoundingClientRect();
  // console.log(testModels.value.getBoundingClientRect());
  // console.log(
  //   pointer.x, pointer.y,
  //   ((event.clientX - boundingRect.left) / boundingRect.width) * 2 - 1,
  //   -((event.clientY - boundingRect.top) / boundingRect.height) * 2 + 1
  // );

  // 每次点击事件发生后后重新获取值，获取标签的宽高属性值
  const rect = canvas.getBoundingClientRect();
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera);
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    // 射线涉及到的物体集合
    console.log(intersects);
  } else if (intersects.length === 0) {
  }
});
```

### 自定义鼠标右键平移模型效果

部分浏览器会出现鼠标手势的问题，无法正常进行右键平移模型,  
所以通过自定义鼠标事件，来实现完成平移模型的效果，  
但是目前移动是有缺陷的，鼠标右键点击松开后开始平移


```javascript
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
    console.log(mouseX0, mouseY0);

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
    // console.log(dx, dy);

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
    console.log("鼠标松开");
    // 移除鼠标移动事件监听
    document.removeEventListener("mousemove", onMouseMove, false);
    // 移除鼠标松开事件监听
    document.removeEventListener("mouseup", onMouseUp, false);
  }
};
```

### 三维物体（Object3D）组（Group）

可以通过.add( object )方法来将对象进行组合，该方法将对象添加为子对象，但为此最好使用Group（来作为父对象）。

.remove ( object : Object3D )
从当前对象的子级中移除对象。可以移除任意数量的对象。

.traverse ( callback : Function )
callback - 以一个object3D对象作为第一个参数的函数。  
遍历 model 的所有子对象 无论多少层  
traverse方法会递归地遍历根对象的所有子对象，并且对于每个子对象执行提供的回调函数。  
当找到要删除的对象时，我们从它的父对象中调用remove方法来删除它。

```javascript
function removeObjectFromScene(root, objectToRemove) {  
  // 遍历root的所有子对象  
  root.traverse(function(child) {  
    // 如果找到要删除的对象  
    if (child === objectToRemove) {  
      // 从父对象中移除它  
      const parent = child.parent;  
      if (parent) {  
        parent.remove(child);  
      }  
    }  
  });  
}  
  
// 假设你有一个名为objectToRemove的对象，你想从整个场景或某个Group中删除它  
// 你需要知道这个对象或者能够通过某种方式识别它（比如通过名字或其他属性）  
  
// 使用上面的函数来删除对象  
removeObjectFromScene(yourSceneOrGroup, objectToRemove);
```

```javascript
/**
 * 关联嵌套模型的方法 将模型一层层嵌套添加到上一个模型关节的children中
 * 手动添加模型分组，添加后再将原本整体模型中的组件数据删除
 * @param value {string} 选择 被 关联模型的 name 值
 * @param item {string} 需要关联的模型的值, models 去关联绑定 name； 在被关联后就无法再次被点击关联
 */
const NestedChildren = (value, item) => {
  // console.log(value, item);
  let models = findModel(value); // 被关联的模型
  let models1 = findModel(item); // 寻求关联的模型
  if (models && models1) {
    // 关联模型创建一个分组对象
    const model_group = new THREE.Object3D();
    model_group.name = item + "_group";
    model_group.add(models1.clone());
    const parent = models1.parent; // 需要关联模型的父对象

    // 被关联模型创建一个分组对象
    const model_group1 = new THREE.Object3D();
    model_group1.name = value + "_group";
    model_group1.add(models.clone());
    model_group1.add(model_group);
    const parent1 = models.parent; // 被关联模型的父对象

    // console.log(parent.name, parent1.name);
    if (parent1.name === value + "_group") {
      // 已存在被关联模型组件的分组对象，无需再次创建，直接导入需求关联的模型
      // 一种是迁移分组，一种是在原本的分组中添加新的子组件
      console.log("已存在被关联模型组件的分组对象");
      let object_group;
      roboticArmModel.traverse((child) => {
        if (child instanceof THREE.Object3D && child.name === item + "_group") {
          console.log(child.name, item + "_group");
          object_group = child;
          return;
        }
      });
      // console.log(object_group);
      if (object_group) {
        parent1.add(object_group); // 加入的应该是之前的object分组，包含里面已分组的模型组件
        parent.remove(object_group); // 删除的也应该是包含已分组模型组件的object分组
        console.log("需要关联的对象分组已创建");
      } else {
        console.log("需要关联的对象没有创建分组");
        parent1.add(model_group);
        parent.remove(models1);
        // parent1.remove(models);
      }
    } else if (parent.name === item + "_group") {
      /* 
        进行一种情况的判断，当object3D原本是存在的，此次修改只是切换关联对象，
        只删除了原本的Group 但是未删除 object3D ，留下个空壳子,
        要清除干净，不留痕迹
        还得携带着原本关联的对象一起切换，拖家带口
      */
      const parent_parent = parent.parent;
      console.log("object3D原本是存在的,切换关联对象", parent_parent);
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
      console.log("普普通通的关联对象");
      parent1.add(model_group1);
      parent.remove(models1);
      parent1.remove(models);
    }
  }

  // console.log(models, models1, roboticArmModel);
  console.log("切换后的整体模型数据", roboticArmModel);
};

```
  
```javascript
// 根据传递的组件的name值，遍历整体模型中的所有子模型 不管多少层 获取到需要去关联的模型
const findModel = (name) => {
  // console.log(name); // 进行操作的模型名称
  let model;
  roboticArmModel.traverse((child) => {
    if (child instanceof THREE.Group && child.name === name) {
      model = child;
      return;
    }
  });
  return model;
};

```

### 封装一个渲染模型的方法

通过获取到的模型数据，直接导入渲染模型  
封装一个模型渲染方法，减少代码量

```javascript

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
  // treeModelsData(roboticArmModel);
};

```

### 导入本地模型渲染

```html
<el-upload
  action=""
  :on-preview="handlePreview"
  :on-success="handleSuccess"
  :on-progress="handleProgress"
  :before-upload="handleBeforeUpload"
  :http-request="uploadURL"
  :show-file-list="false"
  :on-change="handleChange"
  multiple
  accept=".glb,.obj,.gltf,.fbx,.stl"
>
  <el-button>导入模型</el-button>
</el-upload>
```

事件触发
```js
import { setGltfModel, setStlModel, setObjModel } from '../../utils/ImportModel.js'

handleChange(file, fileLists) {
  // console.log('fileLists >>> ', fileLists) // 上传文件列表

  this.robotNameList
  const filePath = URL.createObjectURL(file.raw)
  // console.log(file, filePath) // file.raw
  const fileExtension = file.name.split('.').pop().toLowerCase()
  const fileName = file.name.split('.')[0]
  this.robotNameList.push(fileName)
  const model = {
    filePath,
    fileType: fileExtension
  }
  // console.log(model.fileType, fileName)
  switch (model.fileType) {
    case 'glb':
      setGltfModel(filePath, fileName)
      break
    case 'gltf':
      setGltfModel(filePath, fileName)
      break
    case 'stl':
      setStlModel(filePath, fileName)
      break
    case 'obj':
      setObjModel(filePath, fileName)
      break
    default:
      break
  }
  console.log('Scene >>>', this.$store.state.threeModels.sceneStore)
}
```

封装的倒入不同格式模型的方法

```js
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

const gltfloader = new GLTFLoader()
const stlloader = new STLLoader()
const objloader = new OBJLoader()

const group = new THREE.Group()
group.name = 'gltfModelGroup'

const group_1 = new THREE.Group()
group_1.name = 'stllModelGroup'

// 导入 store 共享使用
import store from '../store/index'

/**
 * glb gltf格式模型导入
 * @param filePath {string} 要导出的场景或对象
 * @param fileName {string} 导出模型的格式
 */
export function setGltfModel(filePath, fileName) {
  // const material = new THREE.MeshPhysicalMaterial({
  //   color: 0xe7e7e7,
  //   metalness: 1.0,
  //   roughness: 0.5,
  //   clearcoat: 1.0,
  //   clearcoatRoughness: 0.05,
  //   clearcoatNormalScale: 0.1
  // })
  // console.log(material)
  gltfloader.load(
    filePath,
    (glb) => {
      glb.scene.traverse((child) => {
        // console.log('child', child)
        if (child.isMesh && child instanceof THREE.Mesh) {
          // child.material = material
          console.log(child)
          child.material.color = new THREE.Color(0xe7e700)
        }
      })
      // console.log(glb.scene)
      glb.scene.name = fileName
      // glb.scene.scale.set(50, 50, 50)
      glb.scene.position.x += 500

      const rotateGroup = new THREE.Group()
      rotateGroup.name = fileName + '_RotateGroup'

      const model_group = new THREE.Group()
      model_group.name = fileName + '_MoveGroup'

      rotateGroup.add(glb.scene)
      model_group.add(rotateGroup)
      group.add(model_group)

      store.commit('threeModels/renderModel', group)
    },
    (xhr) => {
    // 加载进度
      // const percent = xhr.loaded / xhr.total
      // console.log(fileName + ' 加载进度 ' + (percent * 100).toFixed(2))
    },
    (err) => {
      console.log(err)
    }
  )
}

// stl 格式模型导入
export function setStlModel(filePath, fileName) {
  stlloader.load(
    filePath,
    (stl) => {
      console.log(stl)
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x727200
      })
      const mesh = new THREE.Mesh(stl, material)
      mesh.name = fileName
      mesh.rotation.x = -0.5 * Math.PI
      // mesh.scale.set(50, 50, 50)
      mesh.position.x -= 500
      console.log('stl', mesh)
      store.commit('threeModels/renderModel', mesh)

    //   console.log(stl)
    },
    (xhr) => {
    // 加载进度
      const percent = xhr.loaded / xhr.total
      console.log(fileName + ' 加载进度 ' + (percent * 100).toFixed(2))
    },
    (err) => {
      console.log(err)
    }
  )
}

// obj 格式模型导入
export function setObjModel(filePath, fileName) {
  objloader.load(
    filePath,
    (obj) => {
      //   store.commit('threeModels/renderModel', obj)
    //   const material = new THREE.MeshLambertMaterial({
    //     color: 0x727200
    //   })
      obj.name = fileName
      // obj.scale.set(50, 50, 50)
      obj.position.z += 400
      store.commit('threeModels/renderModel', obj)
      console.log('obj', obj)
    },
    (xhr) => {
      // 加载进度
      const percent = xhr.loaded / xhr.total
      console.log(fileName + ' 加载进度 ' + (percent * 100).toFixed(2))
    },
    (err) => {
      console.log(err)
    }
  )
}

```

### 导出本地模型渲染

glTF (GL Transmission Format) 是一个用于高效传输和加载3D内容的 开放格式规范。 资源可以以 JSON (.gltf) 或二进制 (.glb) 格式提供。外部文件存储纹理 (.jpg, .png) 和额外的二进制数据 (.bin)。一个 glTF 资产可以包含一个或多个场景，包括网格、材质、纹理、蒙皮、骨骼、变形目标、动画、灯光和/或相机。

```js
// import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

const exporterGltf = new GLTFExporter()
// 导入 store 共享使用
// import store from '../store/index'

/**
 * 导出 glb 格式的模型
 * @param object {THREE.Group} 要导出的场景或对象
 * @param fileType {string} 导出模型的格式
 */
export function exporterGltfModel(object, fileType) {
  const options = {
    trs: true, // 是否保留位置、旋转、缩放信息
    // animations: this.modelAnimation, // 导出的动画
    binary: fileType === 'glb', // 是否以二进制格式输出
    embedImages: true, // 是否嵌入贴图
    onlyVisible: true, // 是否只导出可见物体
    forcePowerOfTwoTextures: true,
    includeCustomMaterials: true, // 指定是否包含自定义材质
    includeCustomAttributes: true, //   指定是否包含自定义属性
    includeCustomTextures: true, // 指定是否包含自定义纹理
    includeCustomSamplers: true, // 指定是否包含自定义采样器
    includeCustomImages: true, //   指定是否包含自定义图像
    includeCustomTechniques: true, //   指定是否包含自定义技术
    includeCustomMaterialsCommon: true, // 指定是否包含自定义 MaterialsCommon
    includeCustomMeshes: true, // 指定是否包含自定义网格
    includeCustomSkins: true, // 指定是否包含自定义皮肤
    includeCustomNodes: true, // 指定是否包含自定义节点
    includeCustomGeometries: true, // 指定是否包含自定义几何体
    includeCustomPrograms: true, // 指定是否包含自定义程序
    includeCustomShaders: true, // 指定是否包含自定义着色器
    includeCustomExtensions: true // 指定是否包含自定义扩展。如果设置为true，则会包含在导出中定义的自定义GLTF扩展
  }
  exporterGltf.parse(
    object,
    function(gltf) {
      console.log(gltf, object, fileType)
      if (gltf instanceof ArrayBuffer) {
        // 将结果保存为GLB二进制文件
        saveArrayBuffer(gltf, `${new Date().toLocaleString()}.glb`)
      } else {
        // 将结果保存为GLTF JSON文件
        saveString(JSON.stringify(gltf), `${new Date().toLocaleString()}.gltf`)
      }
    },
    (err) => {
      console.error(err)
    },
    options
  )
}

export function saveArrayBuffer(buffer, filename) {
  // 将二进制数据保存为文件
  const blob = new Blob([buffer], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
export function saveString(text, filename) {
  // 将字符串数据保存为文件
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
```

### 使用模型动画效果 animations

```js
// 创建GLTF实例
const loader = new GLTFLoader();
// 加载模型
let mixer = null;
// 飞行器动画模型
const percentage = ref(0);
let glt_model;
let glt_model_child;
loader.load(
  "./models/glbModels/buster_drone.glb",
  (glb) => {
    console.log("glb", glb);
    // 遍历模型中的物体
    glb.scene.traverse((child) => {
      // console.log(child);
      if (child.isMesh) {
        if (child.name === "F_P7_leg_0") {
          child.material = new THREE.MeshPhongMaterial({
            color: 0xff1100,
          });
          glt_model_child = child;
          glt_model_child.material.visible = isFootVisible.value; // 控制模型显示隐藏
          // console.log(glt_model_child.material);
        }
      }
    });
    glt_model = glb.scene;
    glt_model.scale.set(1, 1, 1);
    glt_model.position.set(-10, 2, 0);
    glt_model.rotation.y = (Math.PI / 4) * 3;
    // moveAnimationFrame();
    // mixer = new THREE.AnimationMixer(glb.scene);
    // // 这个方法会返回一个AnimationAction
    // const action = mixer.clipAction(glb.animations[0]);
    // // 使用play()方法调用这个AnimationAction
    // action.play();

    // mixer = startAnimation(glb.scene, glb.animations, glb.animations[0].name);

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
```

### Three.js使用Draco解压模型

```js
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// 导入Draco加载器
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'

// 路径 three/examples/jsm/libs/draco

const gltfLoader = new GLTFLoader();
// 实例化draco载入库
const dracoLoader = new DRACOLoader();
// 添加draco载入库
dracoLoader.setDecoderPath("./draco/");
// 添加draco载入库
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(
    // 模型路径
    "/src/assets/model/road.glb",
    (gltf)=>{
        console.log(gltf)
    }
)
```