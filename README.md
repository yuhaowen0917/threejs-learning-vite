# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).


在 Vue 中，直接使用 addEventListener 来监听元素宽高变化并不简单，因为原生的 DOM 事件并不包括元素的尺寸变化。但是，你可以使用一种称为“Resize Observer”的 API 来实现这个功能。

Resize Observer 是一个能够异步观察元素尺寸变化的接口。如果元素的大小发生变化，则会通知你。

以下是如何在 Vue 组件中使用 Resize Observer 的示例：

```
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
      this.resizeObserver = new ResizeObserver(entries => {  
        for (let entry of entries) {  
          console.log(entry.contentRect); // 这里你可以获取到元素的尺寸信息  
          // 在这里你可以添加你自己的逻辑，比如更新 Vue 的数据等  
        }  
      });  
      this.resizeObserver.observe(element);  
    }  
  }  
}  
</script>
```
模型点击事件，通过光射线.Raycaster()

```
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

```
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