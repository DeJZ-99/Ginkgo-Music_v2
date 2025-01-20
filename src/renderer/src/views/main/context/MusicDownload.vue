<template>
    <div class="music-download">
        <div class="item" v-for="(item, index) in downloadList" :key="index">
            <div class="info">
                <span class="songname">{{ item.songname }}</span> -
                <span class="singer">{{ item.singer }}</span>
            </div>
            <div class="progress">
                <div class="thumb" :style="{ width: `${item.progress}%` }"></div>
            </div>
            <span class="percent">{{ item.progress }}%</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore, useBtnStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';

const store = useBtnStore();
const { titleName, downloadList } = storeToRefs(useStore());
const { delStatus, sideBarBtnStatus } = storeToRefs(store);
const { initBtnStatus } = store;

onMounted(() => {
    titleName.value = "下载列表";
    initBtnStatus();
    sideBarBtnStatus.value.fill(false);
    sideBarBtnStatus.value[2] = true;
    delStatus.value = true;
})
</script>

<style lang="less" scoped>
.music-download {
    .flex-style(@justify: normal, @align: normal, @column: column);
    gap: 1vw;

    .item {
        .box-shadow();
        .radius-transition();
        .flex-style(@justify: space-between);
        padding: 1vh;
        width: 100%;
        font-size: 90%;

        .info {
            .overflow-hidden(20%);
            font-size: 80%;
        }

        .progress {
            .progress-style(@min-w: 75%, @max-w: 90%);
        }

        &:hover {
            transform: translateY(-3px);
        }
    }
}
</style>