<template>
  <!-- 用于测试threejs组件，非全屏的情况下，监听组件的宽高实现实时变化 ref -->
  <div class="tets-pages">
    <testComponents />
  </div>
</template>

<script setup>
import testComponents from "./testComponents.vue";
</script>

<style lang="scss" scoped>
.tets-pages {
    width: 75%;
    height: 600px;
    margin: 120px 0 0 120px;
}
</style>