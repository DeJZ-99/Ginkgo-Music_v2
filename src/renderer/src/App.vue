<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <component :is="Component"></component>
    </transition>
  </router-view>
  <Footer />
</template>

<script setup lang="ts">
import Footer from '@renderer/views/Footer.vue'

import { onMounted } from 'vue';
import ctrl from './utils/music_api';

onMounted(() => ctrl.load())
</script>

<style lang="less" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
