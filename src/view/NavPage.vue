<template>
  <!-- 导航页面 -->
  <div class="nav-box">
    <div class="nav-item" v-for="item in nav_list" :key="item.name">
      <span @click="goPath(item.path)">{{ item.meta.desc }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const nav_list = ref(router.options.routes);

// console.log(nav_list.value);

const goPath = (e) => {
  router.push(e);
};
</script>

<style lang="scss" scoped>
.nav-box {
  margin: 160px 0 0 120px;
  .nav-item {
    margin: 12px 0;
    padding: 8px 0;
    span {
      cursor: pointer;
      padding: 12px;
      &:hover {
        color: #4690ff;
      }
    }
  }
}
</style>