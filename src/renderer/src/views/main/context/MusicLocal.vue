<template>
    <div class="music-loacl">
        <transition-group name="list">
            <div class="item" v-for="(item, index) in localMusic" :key="index" @click="playLocalMusic(index)"
                :class="{ active: status[index] }">
                <span class="index">{{ index + 1 }}</span>
                <span class="songname">{{ item.songname }}</span>
                <span class="singer">{{ item.singer }}</span>
                <div class="icon">
                    <span class="iconfont" @click.stop="deleteMusic(index)">&#xe725;</span>
                    <span class="iconfont" @click.stop="addMusic(index)">&#xe61f;</span>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore, useBtnStore, useMusicStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import { read, save } from '@renderer/utils/engine'
import ctrl from '@renderer/utils/music_api';
import dialog from '@renderer/utils/dialog';

const store = useBtnStore();
const { titleName, localMusic, likeMusic, musicItems } = storeToRefs(useStore());
const { ordinal, list, manner } = storeToRefs(useMusicStore());
const { refreshStatus, locatingStatus } = storeToRefs(store);

interface Song {
    songname: string;
    singer: string;
}

interface Music extends Song {
    url: string;
}

const status = ref<boolean[]>(Array(localMusic.value.length).fill(false))

const playLocalMusic = (index: number): void => {
    musicItems.value = document.querySelectorAll('.item');
    ordinal.value = index;
    list.value = read('music_info', true);
    manner.value = "local";
    const info: Song = list.value[index];
    const data: Music = {
        songname: info.songname,
        singer: info.singer,
        url: read('music_list', true)[index]
    }
    ctrl.play(data, manner.value);
    status.value = status.value.map((_item, i) => i === index);
}

const addMusic = (index: number): void => {
    const music: Song = localMusic.value[index];
    const musicList: Song[] = read('like_music', true) || [];
    if (!musicList.some((item: Song) => item.songname === music.songname && item.singer === music.singer)) {
        musicList.push(music);
        save('like_music', musicList, true);
        likeMusic.value = musicList;
        dialog.show(`${music.songname} 添加成功！`, false);
    } else dialog.show(`${music.songname} 已存在！`, false);
}

const deleteMusic = (index: number): void => {
    const list: string[] = read('music_list', true)
    list.splice(index, 1)
    localMusic.value.splice(index, 1);
    if (ordinal.value >= index) ordinal.value = index - 1;
    save('music_info', localMusic.value, true);
    save('music_list', list, true);
};

watch(() => ordinal.value, () => {
    status.value = status.value.map((_item, i) => i === ordinal.value);
})

onMounted(() => {
    titleName.value = "本地音乐";
    refreshStatus.value = true;
    locatingStatus.value = true;
})
</script>

<style lang="less" scoped>
.music-loacl {
    .flex-style(@justify: normal, @align: normal, @column: column);
    gap: 1vw;
    height: 62.5vh;
    padding: 1vh;
    overflow-y: scroll;

    .item {
        width: 100%;
        .box-shadow();
        .radius-transition();
        .flex-style(@justify: normal);
        padding: 1vh;

        span {
            width: (87% / 2);
            text-align: center;
            font-size: 90%;

            &:nth-child(1) {
                width: 5%;
            }
        }

        .icon {
            width: 8%;
            .flex-style(@justify: space-around, @align: normal);
        }

        &:hover {
            transform: translateY(-3px);
        }
    }

    .active {
        color: var(--font-active-color);
    }

    .list-enter-active,
    .list-leave-active {
        transition: all 0.3s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
}
</style>