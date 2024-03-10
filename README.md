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