<template>
  <!-- 用于测试threejs组件，非全屏的情况下，监听组件的宽高实现实时变化 ref -->
  <div class="tets-pages">
    <testComponents />
  </div>

  <!-- <div class="tets-pages">
    <div class="top">
      <div class="left">
        <testComponents />
      </div>
      <div class="right" v-if="right">111</div>
    </div>
    <div class="down"  v-if="down">
      111
    </div>
  </div>
  <div>
    <button @click="right = !right">{{ right }}</button>
    <button @click="down = !down">{{ down }}</button>
  </div> -->
</template>

<script setup>
import { ref } from "vue";
import testComponents from "./testComponents.vue";

const right = ref(true);
const down = ref(true);
</script>

<style lang="scss" scoped>
// .tets-pages {
//   width: 80%;
//   height: 600px;
//   margin: 120px 0 0 50px;
//   border: 1px solid #5a2dfd;
//   display: flex;
//   flex-direction: column;
//   .top {
//     flex: 1;
//     width: 100%;
//     height: 100%;
//     display: flex;
//     .left {
//       max-width: 100%;
//       height: 100%;
//       flex: 1;
//     }
//     .right {
//       width: 50px;
//       height: 100%;
//     }
//   }
//   .down {
//     width: 100%;
//     height: 50px;
//   }
// }
.tets-pages {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>