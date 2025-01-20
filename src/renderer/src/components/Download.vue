<template>
    <div class="download-box">
        <div class="info">{{ songname }} - {{ singer }}</div>
        <div class="options">
            <span @click="downloadMusic('NQ')">标准音质</span>
            <span @click="downloadMusic('HQ')">高品音质</span>
            <span @click="downloadMusic('SQ')">无损音质</span>
        </div>
        <button @click="download.hide">取消</button>
    </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue';
import { matchMusic } from '@renderer/utils/engine';
import download from '@renderer/utils/download';
import dailog from '@renderer/utils/dialog';

const props = defineProps({
    data: {
        type: Object as PropType<{
            songname: string;
            singer: string;
        }>,
        required: true
    }
});

const { songname, singer } = toRefs(props.data);

const downloadMusic = (type: string): void => {
    matchMusic({
        songname: songname.value,
        singer: singer.value
    }, type, 'download');
    download.hide();
    dailog.show(`${songname.value} 已加入下载列表！`, false);
}
</script>

<style lang="less" scoped>
.download-box {
    .position-style(@top: 50%, @left: 50%, @x: -50%, @y: -50%);
    .flex-style(@justify: normal, @column: column);
    .bg-gradient(@n: 45deg);
    .box-shadow();
    .radius-transition();
    padding: 1vh;
    gap: 1vh;
    font-size: 80%;
    text-align: center;

    .options {
        .flex-style(@justify: normal, @column: column);
        gap: 1vh;

        span {
            .btn-style(@s: 0.5vh);
        }
    }

    button {
        outline: none;
        border: none;
        .btn-style(@h: 2.1vw, @s: 0.5vh);
        .font-gradient();
    }
}
</style>