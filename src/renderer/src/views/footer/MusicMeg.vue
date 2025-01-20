<template>
    <div class="music-info">
        <div>
            <img :src="playingMsg.img || img" @click.stop="linkPage">
            <div class="info">
                <span class="songname">{{ playingMsg.songname || '歌名' }}</span>
                <span class="singer">{{ playingMsg.singer || "歌手" }}</span>
            </div>
        </div>
        <span class="iconfont" v-show="lyricStatus" @click="searchLyrics">&#xe7d4;</span>
    </div>
</template>

<script setup lang="ts">
import { useStore, useBtnStore, useMusicStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import { toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { matchMusic } from '@renderer/utils/engine';

const route = useRoute();
const router = useRouter();
const { playingMsg, prePath } = storeToRefs(useStore());
const { lyricStatus } = storeToRefs(useBtnStore());
const { quality } = storeToRefs(useMusicStore());

const img: string = new URL('../../assets/imgs/music.png', import.meta.url).href;

const linkPage = (): void => {
    lyricStatus.value = !lyricStatus.value;
    const excludedRoutes: string[][] = [['lyrics', 'groove'], ['match', 'search']];
    const currentRoute: string = route.name as string;
    if (!excludedRoutes[0].includes(currentRoute) && !excludedRoutes[1].includes(currentRoute)) prePath.value = currentRoute;
    if (excludedRoutes[0].includes(currentRoute)) {
        excludedRoutes[1].includes(currentRoute) && router.push({ name: prePath.value });
        router.push({ name: prePath.value });
    } else router.push({ name: 'lyrics' });
}

const searchLyrics = (): void => {
    const { songname, singer } = toRefs(playingMsg.value);
    const data = {
        songname: songname.value,
        singer: singer.value
    }
    matchMusic(data, quality.value, 'info');
}
</script>

<style lang="less" scoped>
.music-info {
    .flex-style(@justify: space-between);
    .box-shadow();
    margin-left: 1vw;
    border-radius: 8px;

    div {
        .flex-style(@justify: baseline);

        img {
            width: 6.5vw;
            height: 6.5vw;
            margin-right: 1vw;
            .radius-transition();

            &:hover {
                transform: scale(0.8);
                border-radius: 8px;
            }
        }

        .info {
            font-size: 85%;
            .flex-style(@align: normal, @column: column);

            span {
                .overflow-hidden(20vw);
            }
        }
    }

    &>.iconfont {
        .btn-style();
        font-size: 150%;
        margin-right: 1vw;
    }
}
</style>