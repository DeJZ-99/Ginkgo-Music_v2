<template>
    <div class="item" v-for="(item, index) in data" :key="index" @click="playOnlineMusic(index)" :class="{
        active: status[index]
    }">
        <span class="index">{{ index + 1 }}</span>
        <span class="songname">{{ item.songname }}</span>
        <span class="singer">{{ item.singer }}</span>
        <div class="icon">
            <span class="iconfont" @click.stop="addMusic(index)">&#xe61f;</span>
            <span class="iconfont" @click.stop="downloadMusic(index)">&#xe7d3;</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref, toRef, watch } from 'vue';
import { matchMusic, save, read } from '@renderer/utils/engine';
import { useMusicStore, useStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import download from '@renderer/utils/download';
import dialog from '@renderer/utils/dialog';

interface Song {
    songname: string;
    singer: string;
}

const props = defineProps({
    data: {
        type: Array as PropType<Song[]>,
        required: true
    }
});

const { list, ordinal, manner, quality } = storeToRefs(useMusicStore());
const { likeMusic, musicItems } = storeToRefs(useStore());
const data = toRef(props, 'data');

const status = ref<boolean[]>(Array(data.value.length).fill(false));

const playOnlineMusic = (index: number): void => {
    matchMusic(data.value[index], quality.value);
    list.value = data.value;
    manner.value = 'online';
    ordinal.value = index;
    status.value = status.value.map((_item, i) => i === index);
}

const addMusic = (index: number): void => {
    const music: Song = data.value[index];
    const musicList: Song[] = read('like_music', true) || [];
    if (!musicList.some((item: Song) => item.songname === music.songname && item.singer === music.singer)) {
        musicList.push(music);
        save('like_music', musicList, true);
        likeMusic.value = musicList;
        dialog.show(`${music.songname} 添加成功！`, false);
    } else dialog.show(`${music.songname} 已存在！`, false);
}

const downloadMusic = (index: number): void => {
    const music = data.value[index];
    download.show(music);
}

watch(() => ordinal.value, () => {
    status.value = status.value.map((_item, i) => i === ordinal.value);
})

onMounted(() => {
    musicItems.value = document.querySelectorAll('.item');
})
</script>

<style lang="less" scoped>
.item {
    .flex-style(@justify: space-between, @align: normal);
    .box-shadow();
    .radius-transition();
    padding: 1vh;

    &:hover {
        transform: translateY(-3px);
    }

    span {
        .flex-style();
        .overflow-hidden(40%);
        width: (85% / 2);
        font-size: 90%;
    }

    .index {
        width: 5%;
    }

    .icon {
        width: 10%;
        .flex-style();
    }
}

.active {
    color: var(--font-active-color);
}
</style>