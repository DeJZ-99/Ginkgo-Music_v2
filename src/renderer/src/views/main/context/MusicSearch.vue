<template>
    <div class="music-search" ref="searchRef">
        <MusicTab :data="data" />
    </div>
</template>

<script setup lang="ts">
import { useStore, useBtnStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';

import MusicTab from '@renderer/components/MusicTab.vue';

const store = useStore();
const btnStore = useBtnStore();
const route = useRoute();
const { titleName, searchItem } = storeToRefs(store);
const { backStatus, backTopStatus, locatingStatus } = storeToRefs(btnStore);
const { initBtnStatus } = btnStore;

const searchRef = ref<HTMLDivElement>();

const data = computed(() => {
    return JSON.parse(route.query.songs as string);
})

onMounted(() => {
    titleName.value = "搜索结果";
    searchItem.value = searchRef.value!;
    initBtnStatus();
    backStatus.value = true;
    backTopStatus.value = true;
    locatingStatus.value = true;
})
</script>

<style lang="less" scoped>
.music-search {
    .flex-style(@justify: normal, @align: normal, @column: column);
    height: 60vh;
    overflow-y: scroll;
    padding: 0.5vh 1vh;
    gap: 1vw;
}
</style>