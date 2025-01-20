<template>
    <div class="music-rank">
        <div class="item" v-for="(item, index) in rankMusic" :key="index" @click="showMusic(index)">
            <div class="info">
                <span class="title">{{ item.rankname }}</span>
                <span class="update-time">更新时间：<span>{{ item.update }}</span></span>
                <span class="update-frequency">更新频率：{{ item.frequency }}</span>
            </div>
            <img :src="item.img_url" alt="">
        </div>
    </div>
</template>

<script setup lang="ts">
import { rankMusicApi } from '@renderer/utils/api';
import { onMounted } from 'vue';
import { handleFigures } from '@renderer/utils/engine';
import { useStore } from '@renderer/store/store';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import getURL from '@renderer/utils/data_url';

const store = useStore();
const router = useRouter();
const { titleName, rankMusic, prePath } = storeToRefs(store);

const showMusic = (index: number) => {
    const songs: object[] = rankMusic.value[index].songs;
    router.push({
        name: "match",
        query: {
            songs: JSON.stringify(songs)
        }
    })
}

onMounted(() => {
    prePath.value = "rank";
    titleName.value = "音乐排行榜";
    rankMusicApi(getURL('rank')).then(res => {
        const data: object[] = res.data.rank.list;
        const arr: object[] = handleFigures(data, "rank");
        rankMusic.value = arr;
    })
})
</script>

<style lang="less" scoped>
.music-rank {
    display: flex;
    flex-wrap: wrap;
    .content-style(2vw);

    .item {
        width: (50% - 2vw);
        .flex-style(@justify: space-between, @align: frist-baseline);
        .box-shadow();
        .radius-transition();

        .info {
            padding: 1vh;
            font-size: 90%;
            .flex-style(@justify: baseline, @align: baseline, @column: column);

            .title {
                .title-style();
            }

            &>:not(:nth-child(1)) {
                font-size: 90%;
            }

            .update-time {
                span {
                    font-size: 90%
                }
            }
        }

        img {
            .img-style();
        }

        &:hover {
            transform: translateY(-3px);
        }
    }
}
</style>