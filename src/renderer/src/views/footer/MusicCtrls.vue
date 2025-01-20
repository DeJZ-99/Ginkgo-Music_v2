<template>
    <div class="play-ctrl">
        <span class="iconfont" data-music="prev" @click="ctrl.prev">&#xea25;</span>
        <span class="iconfont" v-show="!playStopBtnStatus" @click="playMusic">&#xea20;</span>
        <span class="iconfont" v-show="playStopBtnStatus" @click="pauseMusic">&#xea2a;</span>
        <span class="iconfont" data-music="next" @click="ctrl.next">&#xea1d;</span>
    </div>
</template>

<script setup lang="ts">
import { useBtnStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import ctrl from '@renderer/utils/music_api';

const store = useBtnStore();
const { playStopBtnStatus } = storeToRefs(store);

const playMusic = (): void => {
    playStopBtnStatus.value = true;
    ctrl.play();
}
const pauseMusic = (): void => {
    playStopBtnStatus.value = false;
    ctrl.pause();
}
</script>

<style lang="less" scoped>
.play-ctrl {
    .flex-style(@justify: center);
    gap: 2vw;

    .iconfont {
        font-size: 150%;
        padding: .5vh;
        .radius-transition();
        .btn-style();
    }
}
</style>