<template>
  <div class="main">
    <Header />
    <Aside />
    <Context />
  </div>
</template>

<script setup lang="ts">
import Header from '@renderer/views/main/Header.vue';
import Aside from '@renderer/views/main/Aside.vue';
import Context from '@renderer/views/main/Context.vue';
</script>

<style lang="less" scoped>
.main {
  width: 100vw;
  height: 83vh;
  display: flex;
  flex-wrap: wrap;
}
</style>