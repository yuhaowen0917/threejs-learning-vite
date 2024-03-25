<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// console.log(route);

const back = () => {
  router.push("/");
};
</script>

<template>
  <div class="back-btn" @click="back" v-if="route.path !== '/'">返回导航栏</div>
  <router-view></router-view>
</template>

<style scoped lang="scss">
.back-btn {
  position: absolute;
  left: 50px;
  bottom: 20px;
  width: 85px;
  height: 30px;
  line-height: 30px;
  border: 2px solid #4566fa;
  background-color: #4566fa;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  color: #ffffff;
  font-size: 14px;
}
</style>
