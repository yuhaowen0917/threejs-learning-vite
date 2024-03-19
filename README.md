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
