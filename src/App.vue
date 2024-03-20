<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const back = () => {
  router.push("/");
};
</script>

<template>
  <div class="back-btn" @click="back">返回</div>
  <router-view></router-view>
</template>

<style scoped lang="scss">
.back-btn {
  position: absolute;
  left: 50px;
  bottom: 20px;
  width: 70px;
  height: 30px;
  line-height: 30px;
  border: 2px solid #4566fa;
  background-color: #4566fa;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  color: #ffffff;
}
</style>
