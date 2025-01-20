<template>
  <div class="load-box" v-show="msg.show">
    <div class="loading">
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
    <span class="iconfont">&#xe50e;</span>
  </div>
</template>
  
<script setup>
const props = defineProps({
  msg: {
    type: Object,
  },
});
</script>
  
<style lang="less" scoped>
.load-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  z-index: 99;
}

.loading {
  border-radius: 50%;
  perspective: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4rem;
}

.loading .item {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: absolute;
}

.loading .item:first-child {
  border-bottom: 7px solid #fdea2e;
  transform: rotateX(35deg) rotateY(-45deg);
  animation: rotate-one 1s linear infinite;
}

.loading .item:nth-child(2) {
  border-bottom: 7px solid #f40968;
  transform: rotateX(50deg) rotateY(10deg);
  animation: rotate-two 1s linear infinite;
}

.loading .item:last-child {
  border-bottom: 7px solid #77d970;
  transform: rotateX(35deg) rotateY(55deg);
  animation: rotate-three 1s linear infinite;
}

.iconfont {
  font-size: 150%;
  .font-gradient();
}

@keyframes rotate-one {
  to {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes rotate-two {
  to {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(-360deg);
  }
}

@keyframes rotate-three {
  to {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(-360deg);
  }
}
</style>