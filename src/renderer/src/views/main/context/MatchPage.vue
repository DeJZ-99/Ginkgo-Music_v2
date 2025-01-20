<template>
    <div class="match-page">
        <MusicTab :data="data" />
    </div>
</template>

<script setup lang="ts">
import { useBtnStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';

import MusicTab from '@renderer/components/MusicTab.vue';

const btnStore = useBtnStore();
const route = useRoute();
const { backStatus } = storeToRefs(btnStore);

const data = computed(() => {
    return JSON.parse(route.query.songs as string);
})

onMounted(() => {
    backStatus.value = true;
})
</script>

<style lang="less" scoped>
.match-page {
    .flex-style(@justify: normal, @align: normal, @column: column);
    height: 60vh;
    overflow-y: scroll;
    padding: 0.5vh 1vh;
    gap: 1vw;
}
</style>