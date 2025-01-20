<template>
    <div class="groove">
        <canvas id="cvsRef" ref="cvsRef" v-if="show"></canvas>
        <img :src="getImg" :style="{ 'animation-play-state': imgRotate }">
    </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { useGrooveStore, useStore, useThemeStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';

const { playingMsg } = storeToRefs(useStore());
const { themeFontColor } = storeToRefs(useThemeStore())
const { imgRotate, ISINIT, bufferLength, dataArray, analyser } = storeToRefs(useGrooveStore());

const getImg = computed(() => {
    const img = playingMsg.value.img;
    const localImg = new URL('@renderer/assets/imgs/music-playing.png', import.meta.url).href;
    return img ? img : localImg;
})

const show = ref<boolean>(false)
// 画布
const cvsRef = ref<HTMLCanvasElement | null>(null);
// 画布上下文
const ctx = ref<CanvasRenderingContext2D | null>(null)
// 音乐律动的圆心坐标轴
const center = reactive<{ x: number; y: number }>({ x: 0, y: 0 })
// 音乐律动的强度
// const intensity = ref<number>(0)
// 音乐律动的线条数
const bars = ref<number>(0)
// 音乐律动的角度增量
const rot = ref<number>(0)

watch(() => cvsRef.value, () => {
    if (cvsRef.value) {
        ctx.value = cvsRef.value.getContext('2d')!
        draw()
    }
})

/**
 * 初始化画布
 * @returns void
 */
function init(): void {
    if (!cvsRef.value) return
    cvsRef.value.width = window.innerWidth
    cvsRef.value.height = window.innerHeight
    center.x = cvsRef.value.width / 2
    center.y = cvsRef.value.height / 2
}

/**
 * 绘制画布
 * @returns void
 */
function draw(): void {
    if (!ISINIT.value) return;
    init();
    ctx.value!.fillStyle = themeFontColor.value;
    bars.value = 120;
    analyser.value.getByteFrequencyData(dataArray.value);

    const radsPerBar: number = (Math.PI * 2) / bars.value;
    const radius: number = window.innerWidth / 8;

    for (let i = 0; i < 5; i++) {
        drawBars(i, radsPerBar, radius);
    }

    drawCircle(radius);
    show.value && requestAnimationFrame(draw);
}

/**
 * 绘制线条
 * @param i 线条的索引
 * @param radsPerBar 线条的角度增量
 * @param radius 线条的半径
 * @returns void
 */
function drawBars(i: number, radsPerBar: number, radius: number): void {
    if (!ctx.value) return;
    for (let j = 0; j < bars.value / 5; j++) {
        const rads: number = radsPerBar * (j + (bars.value / 5) * i) + rot.value;
        const barHeight: number = dataArray.value![Math.round((bufferLength.value * (j + bars.value / 5 + i)) / bars.value)] * 0.5;
        const barWidth: number = 4;
        const barX: number = center.x;
        const barY: number = center.y;
        const barTermX: number = center.x + Math.cos(rads) * (radius + barHeight);
        const barTermY: number = center.y + Math.sin(rads) * (radius + barHeight);

        ctx.value.save();
        ctx.value.lineWidth = barWidth;
        ctx.value.strokeStyle = themeFontColor.value;

        ctx.value.beginPath();
        ctx.value.moveTo(barX, barY);
        ctx.value.lineTo(barTermX, barTermY);
        ctx.value.stroke();

        ctx.value.restore();
    }
}

/**
 * 绘制圆形
 * @param radius 圆形的半径
 * @returns void
 */
function drawCircle(radius: number): void {
    if (!ctx.value) return;

    ctx.value.fillStyle = 'rgba(0,0,0,0)';
    ctx.value.beginPath();
    ctx.value.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.value.fill();
}

onMounted(() => show.value = true)
onUnmounted(() => show.value = false)
</script>

<style lang="less" scoped>
.groove {
    position: relative;
    width: 100%;
    height: 90%;
    overflow: hidden;

    #cvsRef,
    img {
        .position-style(@top: 50%, @left: 50%, @x: -50%, @y: -50%);
    }

    img {
        width: (100% / 4);
        border-radius: 50%;
        animation: rotate 15s linear infinite;
        transform-origin: center;
    }
}

@keyframes rotate {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>