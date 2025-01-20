<template>
  <div class="header">
    <div class="logo-part">
      <span class="iconfont">&#xe600;</span>
      <span class="title">Ginkgo Music</span>
    </div>
    <div class="search-part">
      <input class="search" placeholder="请输入歌名或歌手名" type="text" v-model="inputValue" @keydown.enter="search" />
      <span class="iconfont button" @click="search">&#xeb0e;</span>
    </div>
    <div class="win-ctrl-part">
      <Theme />
      <span class="iconfont" @click="ctrlWindows('min')">&#xe69b;</span>
      <span class="iconfont" @click="ctrlWindows('close')">&#xe62a;</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Theme from '@renderer/views/header/Theme.vue'

import { ref } from 'vue';
import { searchMusicApi } from '@renderer/utils/api';
import { handleFigures } from '@renderer/utils/engine';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import getURL from '@renderer/utils/data_url';

const router = useRouter();
const route = useRoute();
const inputValue = ref<string>('');
const { prePath } = storeToRefs(useStore());

const search = () => {
  if (!inputValue.value) return;
  searchMusicApi(getURL('search'), inputValue.value).then(res => {
    const result: object[] = res.data.data.lists;
    const arr: object[] = handleFigures(result, "search");
    if (route.name !== 'search' && route.name !== 'match') prePath.value = route.name as string;
    router.push({
      name: 'search',
      query: { songs: JSON.stringify(arr) }
    });
  });
  inputValue.value = '';
}

const ctrlWindows = (type: string): void => {
  window.api.send('window:ctrl', type);
}
</script>

<style lang="less" scoped>
.header {
  -webkit-app-region: drag;
  width: 100vw;
  height: 7vh;
  .flex-style(@justify: space-between);

  span {
    -webkit-app-region: no-drag;
  }

  &>div {
    flex: 1;
    flex-basis: 0;
  }

  .logo-part {
    .flex-style(@justify: start);
    padding-left: 1vw;

    .iconfont {
      font-size: 180%;
      margin-right: 1vw;
    }
  }

  .search-part {
    .flex-style();
    position: relative;

    input {
      -webkit-app-region: no-drag;
      width: 28vw;
      outline: none;
      border: none;
      line-height: 1.8;
      text-indent: 26px;
      .radius-transition();
      .input-style();
    }

    .button {
      -webkit-app-region: no-drag;
      .position-style(@top: 50%, @left: 3vw, @y: -50%);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: var(--font-active-color);
      }
    }
  }

  .win-ctrl-part {
    .flex-style(@justify: end);
    padding-right: 1vw;
    gap: 1vw;

    .iconfont {
      .btn-style();
    }
  }
}
</style>