<template>
    <div class="box">
        <span class="msg">{{ msg }}</span>
        <button v-show="status" @click="dialog.hide()">关闭</button>
    </div>
</template>

<script setup lang="ts">
import dialog from '@renderer/utils/dialog';
import { onUnmounted, ref, toRefs, PropType, onUpdated } from 'vue';

const props = defineProps({
    data: {
        type: Object as PropType<{
            msg: string;
            status: boolean;
        }>,
        required: true
    }
})

const { msg, status } = toRefs(props.data);

const timer = ref<NodeJS.Timeout | null>(null);

onUpdated(() => {
    if (!status.value) {
        timer.value && clearTimeout(timer.value);
        timer.value = setTimeout(() => {
            dialog.hide();
            timer.value = null;
        }, 2000);
    } else {
        timer.value && clearTimeout(timer.value);
        timer.value = null;
    }
})

onUnmounted(() => {
    timer.value && clearTimeout(timer.value);
})
</script>

<style scoped lang="less">
.box {
    .position-style(@top: 50%, @left: 50%, @x: -50%, @y: -50%);
    .radius-transition();
    .box-shadow();
    .flex-style(@column: column);
    .bg-gradient(@n: 45deg);
    gap: 2vw;
    padding: 1vh 3vw;
    font-size: 90%;
    text-align: center;

    button {
        .btn-style(@s: 0.8vh);
        .font-gradient();
        outline: none;
        border: none;
    }
}
</style>