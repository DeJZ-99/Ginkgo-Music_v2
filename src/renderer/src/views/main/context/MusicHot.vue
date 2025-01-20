<template>
    <div class="music-hot">
        <div class="item" v-for="(item, index) in hotMusic" :key="index" @click="showMusic(index)">
            <img :src="item.imgurl" alt="">
            <div class="infos">
                <span class="name">{{ item.specialname }}</span>
                <span class="intro">{{ item.intro }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { hotMusicApi } from '@renderer/utils/api';
import { storeToRefs } from 'pinia';
import { useStore } from '@renderer/store/store';
import { handleFigures } from '@renderer/utils/engine';
import { useRouter } from 'vue-router';
import getURL from '@renderer/utils/data_url';

const store = useStore();
const router = useRouter();
const { titleName, hotMusic, prePath } = storeToRefs(store);

const showMusic = (index: number) => {
    const songs: object[] = hotMusic.value[index].songs;
    router.push({
        name: "match",
        query: {
            songs: JSON.stringify(songs)
        }
    })
}

onMounted(() => {
    prePath.value = "hot";
    titleName.value = "热门音乐";
    hotMusicApi(getURL('hotmsg')).then((res) => {
        const result: object[] = res.data.data.list;
        const arr: object[] = handleFigures(result, "hot");
        hotMusic.value = arr;
    });
})
</script>

<style lang="less" scoped>
.music-hot {
    .flex-style(@justify: normal, @align: normal, @column: column);
    .content-style();

    .item {
        width: 100%;
        height: 20vh;
        .radius-transition();
        .box-shadow();
        .flex-style(@justify: normal);

        img {
            .img-style();
        }

        .infos {
            height: 100%;
            padding: 1vh;
            font-size: 90%;
            .flex-style(@justify: normal, @align: normal, @column: column);

            .name {
                .title-style();
            }

            .intro {
                text-indent: 2em;
                font-size: 90%;
            }
        }

        &:hover {
            transform: translateY(-3px);
        }
    }

}
</style>