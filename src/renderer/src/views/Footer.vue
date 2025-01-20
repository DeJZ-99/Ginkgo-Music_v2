<template>
  <div class="footer">
    <div class="music-progress" @click.stop="ctrlProgress" ref="progressRef">
      <div class="thumb" :style="{ width: timePercent }"></div>
    </div>
    <div class="music-time-ratio">
      <span class="now-time">{{ nowTime }}</span>/<span class="total-time">{{ totalTime || "00:00" }}</span>
    </div>
    <div class="speed-ctrl" @click.stop="showSpeed">
      <span class="text">{{ showWidth }}</span>
      <div class="speed" :style="{ width: boxWidth }">
        <span v-for="(item, index) in speedValues" :key="index" :class="{ active: isChecked[index] }"
          @click="changeSpeed($event, index)">
          {{ item }}
        </span>
      </div>
      <span>倍速</span>
    </div>
    <div class="music-ctrl">
      <MusicMeg />
      <MusicCtrls />
      <SystemCtrls />
    </div>
  </div>
</template>

<script setup lang="ts">
import MusicMeg from './footer/MusicMeg.vue';
import MusicCtrls from './footer/MusicCtrls.vue';
import SystemCtrls from './footer/SystemCtrls.vue';

import { useMusicStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import { computed, ref, Ref } from 'vue';
import { handleTime } from '@renderer/utils/engine';
import ctrl from '@renderer/utils/music_api';

const musicStore = useMusicStore();
const { duration, currentTime, speed } = storeToRefs(musicStore);
const progressRef: Ref<HTMLDivElement | null> = ref(null);
const boxWidth: Ref<string> = ref('0vw');
const showWidth: Ref<string> = ref("1.0");
const speedValues: Ref<string[]> = ref(['0.5×', '1.0×', '1.5×', '2.0×']);
const isChecked: Ref<boolean[]> = ref([false, true, false, false]);

const ctrlProgress = (event: MouseEvent): void => {
  if (!progressRef.value) return;
  const { clientX } = event;
  const { left, width } = progressRef.value.getBoundingClientRect();
  const percent: number = (clientX - left) / width;
  ctrl.progress(duration.value * percent)
};

const timePercent = computed(() => duration.value === 0 ? 0 : `${(currentTime.value / duration.value) * 100}%`);
const nowTime = computed(() => handleTime(currentTime.value));
const totalTime = computed(() => handleTime(duration.value))

const changeSpeed = (event: MouseEvent, index: number): void => {
  isChecked.value = isChecked.value.map((_, i) => i === index);
  const target: HTMLElement = event.target as HTMLElement;
  const num: string = parseFloat(target.textContent || '').toFixed(1);
  showWidth.value = num;
  speed.value = Number(num);
  ctrl.speed(Number(num));
}

const showSpeed = (): string => boxWidth.value = boxWidth.value === '0vw' ? "13.5vw" : "0vw"
</script>

<style lang="less" scoped>
.footer {
  width: 100vw;
  height: 17vh;
  .flex-style(@justify: baseline, @column: column);
  .position-style(@bottom: 0);

  audio {
    display: none !important;
  }

  .music-progress {
    .progress-style(@min-w: 98%);
  }

  .music-time-ratio {
    .flex-style();
    font-size: 70%;
    margin-top: 1.5vh;
  }

  .speed-ctrl {
    .position-style(@right: 1vw, @top: 1.5vw);
    .radius-transition(@r: 0.5vh);
    font-size: 60%;
    font-weight: bold;
    display: flex;
    border: 1px solid var(--font-color);
    padding: 0 0.5vh;

    .speed {
      margin-left: 1vw;
      display: flex;
      gap: 1vw;
      overflow: hidden;
      transition: all 0.3s;

      span {
        width: 2.5vw;
        text-align: center;
      }
    }

    .active {
      color: var(--font-active-color);
    }
  }

  .music-ctrl {
    width: 100vw;
    display: flex;

    &>div {
      width: calc(100% / 3);
    }
  }
}
</style>