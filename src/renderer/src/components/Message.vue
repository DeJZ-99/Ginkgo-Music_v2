<template>
    <div class="msg" :style="{ left: boxX, top: boxY }" ref="msgRef">{{ msg }}</div>
</template>

<script setup lang="ts">
import { computed, toRefs, PropType, ref } from 'vue';

const props = defineProps({
    data: {
        type: Object as PropType<{
            x: number,
            y: number,
            width: number,
            height: number,
            msg: string,
            dir: string
        }>,
        required: true
    }
})

const { x, y, width, height, msg, dir } = toRefs(props.data);
const msgRef = ref<HTMLDivElement>();

const boxX = computed(() => {
    const func = {
        left: () => `${x.value - width.value * 2 - 10}px`,
        right: () => `${x.value + width.value + 10}px`,
    }
    return func[dir.value]?.()
})
const boxY = computed(() => {
    const func = {
        left: () => `${y.value + height.value / 2}px`,
        right: () => `${y.value + height.value / 2}px`,
    }
    return func[dir.value]?.()
})
</script>

<style lang="less" scoped>
.msg {
    .btn-style(@s: 0.8vh);
    .radius-transition();
    .position-style(@y: -50%);
    font-size: 90%;
    width: fit-content;
}
</style>