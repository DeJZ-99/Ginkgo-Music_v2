<template>
    <div class="lyrics">
        <Carousel :data="imgInfo"></Carousel>
        <router-view></router-view>
        <div class="lyrics-box" ref="boxRef" :style="{ height: boxHeight }">
            <p v-for="(item, index) in lyrics" :key="index" :id="index" ref="lyricRow"
                :class="{ active: index === currentLyricIndex }" @click="scrollToLyric(index)">
                {{ item }}
            </p>
        </div>
        <div class="mode">
            <span class="iconfont" @click="showGroove">&#xe662;</span>
            <span class="iconfont" @click="showPic">&#xe613;</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import Carousel from '@renderer/components/Carousel.vue';

import { useStore, useMusicStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import { handleWords } from '@renderer/utils/engine';
import { computed, ref, watchEffect, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { singerIdApi, singerPictorialsApi } from '@renderer/utils/api';
import getURL from '@renderer/utils/data_url';
import ctrl from '@renderer/utils/music_api';
import dailog from '@renderer/utils/dialog';

const { playingMsg } = storeToRefs(useStore());
const { currentTime } = storeToRefs(useMusicStore());
const router = useRouter();

// 包含歌词的所有行元素
const lyricRow = ref<HTMLDivElement | null>(null);
// 歌词框元素
const boxRef = ref<HTMLDivElement | null>(null);
// 当前歌词索引
const currentLyricIndex = ref<number>(0);
// 歌词框的高度
const boxHeight = ref<string>('80%');
// 图片信息：图片地址数组，是否显示
const imgInfo = reactive<{ imgs: string[]; status: boolean }>({
    imgs: [],
    status: false,
})

// 显示图片轮播
const showPic = async (): Promise<void> => {
    boxHeight.value = '80%';
    router.push({ name: 'lyrics' });
    imgInfo.imgs = [];
    const res: any = await singerIdApi(getURL('search'), playingMsg.value.singer);
    const idArr: string[] = res.data.data.lists[0].SingerId;
    for (const id of idArr) {
        const res: any = await singerPictorialsApi(getURL('pic'), id);
        const imgObjectArr: { file: string }[] = res.data.data[0].imgs;
        if (!imgObjectArr) return dailog.show('该歌手暂无写真！', false);
        imgInfo.imgs = imgObjectArr.map(item => item.file);
        if (imgInfo.imgs.length !== 0) imgInfo.status = true;
    }
};
// 监听歌曲切换，刷新图片轮播
watch(() => playingMsg.value.songname, () => showPic())

// 显示音乐律动
const showGroove = (): void => {
    boxHeight.value = '4%';
    router.push({ name: 'groove' });
    imgInfo.status = false;
}

// 接收歌词原始数据，处理后返回一定格式的歌词对象
const lyrics = computed((): {} => playingMsg.value.lyrics && handleWords(playingMsg.value.lyrics))

// 滚动到指定歌词行：手动滚动
const scrollToLyric = (index: number): void => {
    currentLyricIndex.value = index;
    ctrl.progress(index);
    const lyricRow: HTMLElement | null = document.getElementById(index.toString());
    lyricRow && lyricRow.scrollIntoView({ behavior: "smooth", block: "center" });
};

// 监听当前播放时间，滚动到指定歌词行：自动滚动
watchEffect(() => {
    const time: string = Math.floor(currentTime.value).toString();
    const tag: HTMLElement | null = document.getElementById(time);
    if (!tag) return;
    tag.classList.add("active");
    tag.scrollIntoView({ behavior: "smooth", block: "center" });
    const allTags: NodeListOf<HTMLParagraphElement> = document.querySelectorAll("p");
    allTags.forEach((t) => t !== tag && t.classList.remove("active"));
});
</script>

<style lang="less" scoped>
.lyrics {
    width: 100%;
    height: 83vh;
    .flex-style(@column: column);

    .lyrics-box {
        .flex-style(@justify: normal, @column: column);
        width: 80%;
        overflow-y: scroll;
        gap: 1.2vw;
        transition: all 0.3s;

        p {
            cursor: pointer;
            text-align: center;
            font-style: italic;
            font-size: 90%;
        }

        .active {
            color: var(--font-active-color);
            font-weight: bold;
            font-style: normal;
            transition: all 0.3s;
        }
    }

    .mode {
        .position-style(@top: 10px, @left: 10px);
        display: flex;
        gap: 10px;

        span {
            .btn-style();
        }
    }
}
</style>