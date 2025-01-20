<template>
    <div class="carousel">
        <div class="container" ref="containerRef" v-show="status">
            <div class="item" v-for="(item, index) in imgs" :key="index">
                <img :src="item" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onUpdated, toRefs, PropType } from 'vue'

const props = defineProps({
    data: {
        type: Object as PropType<{
            imgs: string[]
            status: boolean
        }>,
        required: true
    }
})

const { imgs, status } = toRefs(props.data)
const containerRef = ref<HTMLDivElement | null>(null)
const cardIndex = ref<number>(0)
const timerId = ref<NodeJS.Timeout | null>(null)

function moveTo(index: number): void {
    if (!containerRef.value) return
    containerRef.value.style.transform = `translateX(-${index * 100}vw)`
    cardIndex.value = index
}

function next(): void {
    if (imgs.value.length === 0) return
    moveTo(cardIndex.value === imgs.value.length - 1 ? 0 : cardIndex.value + 1)
}

onUpdated(() => {
    if (imgs.value.length < cardIndex.value) moveTo(0)
    if (!status) clearInterval(timerId.value!)
    else {
        clearInterval(timerId.value!)
        timerId.value = setInterval(next, 10000)
    }
})

onUnmounted(() => clearInterval(timerId.value!))
</script>

<style lang="less" scoped>
.carousel {
    z-index: -1;
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;

    .container {
        position: absolute;
        display: flex;

        .item {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 4rem;
            font-weight: bold;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
}
</style>
