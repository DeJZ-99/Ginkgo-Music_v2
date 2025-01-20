<template>
    <div class="other-ctrl">
        <div class="voice-progress" @click.stop="ctrlVolume" ref="progressRef">
            <div class="thumb" :style="{ width: `${volume * 100}%` }"></div>
        </div>
        <div class="voice-ctrl">
            <span class="iconfont" v-show="!volumeBtnStatus" @click="changeVBStatus">&#xe6f5;</span>
            <span class="iconfont" v-show="volumeBtnStatus" @click="changeVBStatus">&#xe6f6;</span>
        </div>
        <div class="mode-ctrl">
            <span class="iconfont" v-show="!playModeBtnStatus" @click="changePMBStatus"
                @mouseover="showMsg('order', $event)" @mouseout="message.hide">&#xe602;</span>
            <span class="iconfont" v-show="playModeBtnStatus" @click="changePMBStatus"
                @mouseover="showMsg('loop', $event)" @mouseout="message.hide">&#xe65b;</span>
        </div>
        <span class="iconfont" @click="showList" @mouseover="showMsg('list', $event)"
            @mouseout="message.hide">&#xe67a;</span>
        <div class="play-list" :style="{ height: boxHeight }">
            <transition-group name="list">
                <div class="item" v-for="(item, index) in likeMusic" :key="index" @click.stop="playMusic(index)">
                    <span class="songname">{{ item.songname }}</span>
                    <span class="iconfont" @click.stop="deleteMusic(index)">&#xe750;</span>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBtnStore, useMusicStore, useStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import { read, save } from '@renderer/utils/engine'
import { ref, Ref } from 'vue';
import { findMusic } from '@renderer/utils/engine';
import ctrl from '@renderer/utils/music_api';
import message from '@renderer/utils/message';

const { volumeBtnStatus, playModeBtnStatus } = storeToRefs(useBtnStore());
const { volume, ordinal, manner } = storeToRefs(useMusicStore());
const { likeMusic } = storeToRefs(useStore());
const progressRef: Ref<HTMLDivElement | null> = ref(null);

const boxHeight = ref<string>('0vh');

const ctrlVolume = (event: MouseEvent): void => {
    if (!progressRef.value) return;
    const { clientX } = event;
    const { left, width } = progressRef.value.getBoundingClientRect();
    const percent: number = (clientX - left) / width;
    ctrl.volume(1 * percent)
}

const changeVBStatus = (): void => {
    volumeBtnStatus.value = !volumeBtnStatus.value;
    ctrl.volume(volumeBtnStatus.value ? 0 : read('volume') || 1)
}
const changePMBStatus = (): void => {
    playModeBtnStatus.value = !playModeBtnStatus.value;
    ctrl.mode();
}

const showList = (): string => boxHeight.value = boxHeight.value === '0vh' ? '70vh' : '0vh';

const playMusic = (index: number): void => {
    manner.value = 'local';
    findMusic(read('like_music', true)[index], read('music_info', true))
}

const deleteMusic = (index: number): void => {
    likeMusic.value.splice(index, 1);
    if (ordinal.value >= index) ordinal.value = index - 1;
    save('like_music', likeMusic.value, true);
};

const showMsg = (type: string, event: Event): void => {
    const msgs = <{ [key: string]: string }>{
        order: '顺序播放',
        loop: '单曲循环',
        list: '特别列表',
    }
    const msg: string = msgs[type];
    const tag: HTMLElement = event.target as HTMLElement;
    const { width, height, x, y } = tag.getBoundingClientRect();
    message.show({ msg, width, height, x, y, dir: 'left' });
}
</script>

<style lang="less" scoped>
.other-ctrl {
    .flex-style(@justify: end);
    margin-right: 1vw;
    gap: 1.5vw;

    &>.iconfont {
        font-size: 120%;
        padding: 1vh;
        .radius-transition();
        .btn-style();
    }

    .voice-progress {
        .progress-style(@min-w: 10vw);
    }

    .voice-ctrl,
    .mode-ctrl {
        .iconfont {
            position: relative;
            font-size: 120%;
            padding: 1vh;
            .radius-transition();
            .btn-style();
        }
    }

    .play-list {
        width: 20vw;
        .position-style(@bottom: 18vh);
        .radius-transition();
        .box-shadow();
        .bg-gradient(@n: 45deg);
        overflow-y: scroll;

        .item {
            .flex-style(@justify: space-between);
            font-size: 90%;
            gap: 1vw;
            padding: 1vh;

            .songname {
                .overflow-hidden(18vw)
            }

            &:hover {
                color: var(--font-active-color);
            }
        }

        .list-enter-active,
        .list-leave-active {
            transition: all 0.3s ease;
        }

        .list-enter-from,
        .list-leave-to {
            opacity: 0;
            transform: translateX(30px);
        }
    }
}
</style>