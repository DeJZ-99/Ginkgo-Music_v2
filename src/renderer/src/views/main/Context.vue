<template>
  <div class="context">
    <div class="title-part">
      <div class="title">{{ titleName || '热门音乐榜' }}</div>
      <div class="ctrls">
        <span v-for="(item, index) in btnMenu" :key="index" @click="hanldeEvent(item.name)"
          @mouseover="showMsg(item.name, $event)" @mouseout="message.hide()" :class="[item.icon, 'iconfont']"
          v-show="item.status.value"></span>
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore, useBtnStore, useMusicStore } from '@renderer/store/store'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { Ref } from 'vue'
import { save } from '@renderer/utils/engine'
import dailog from '@renderer/utils/dialog'
import message from '@renderer/utils/message'

const router = useRouter()
const route = useRoute()
const { titleName, localMusicPath, localMusic, downloadList, prePath, musicItems, searchItem } =
  storeToRefs(useStore())
const { backStatus, delStatus, locatingStatus, refreshStatus, backTopStatus } =
  storeToRefs(useBtnStore())
const { initBtnStatus } = useBtnStore()
const { ordinal } = storeToRefs(useMusicStore())

interface MenuItem {
  status: Ref<boolean>
  icon: string
  name: string
}

const btnMenu: MenuItem[] = [
  { status: backStatus, icon: 'icon-S_rollback_fill', name: 'back' },
  { status: delStatus, icon: 'icon-Delete', name: 'delete' },
  { status: locatingStatus, icon: 'icon-dingwei', name: 'location' },
  { status: refreshStatus, icon: 'icon-Refresh_', name: 'fresh' },
  { status: backTopStatus, icon: 'icon-backTop', name: 'top' }
]

const hanldeEvent = (type: string): void => {
  const func = {
    back: rollBack,
    delete: deleteItems,
    fresh: refeshList,
    location: locatingNow,
    top: backTop
  }
  func[type]?.()
}

const rollBack = (): void => {
  route.name === 'search' ? router.push({ name: prePath.value }) : router.back()
  initBtnStatus()
}

const deleteItems = (): void => {
  downloadList.value = []
  dailog.show('删除成功', false)
}

const refeshList = async (): Promise<any> => {
  if (!localMusicPath.value) return dailog.show('请先设置本地音乐路径')
  const result: string = await window.api.invoke('get:list', JSON.stringify(localMusicPath.value))
  const lists: string[] = JSON.parse(result)
  save('music_list', lists, true)
  const infos = lists.map((item) => {
    const info: string[] = item.replace(/\.mp3|\.flac| /g, '').split('-')
    return {
      songname: info[0],
      singer: info[1]
    }
  })
  save('music_info', infos, true)
  localMusic.value = infos
  dailog.show('刷新成功', false)
}

const locatingNow = (): void => {
  const tag: HTMLDivElement = musicItems.value![ordinal.value]
  tag.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
}

const backTop = (): void => {
  searchItem.value?.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const showMsg = (type: string, event: Event): void => {
  const msgs = <{ [key: string]: string }>{
    back: '返回上页',
    delete: '删除列表',
    fresh: '刷新列表',
    location: '定位音乐',
    top: '回到顶部'
  }
  const msg: string = msgs[type]
  const tag: HTMLElement = event.target as HTMLElement
  const { width, height, x, y } = tag.getBoundingClientRect()
  message.show({ msg, width, height, x, y, dir: 'left' })
}
</script>

<style lang="less" scoped>
.context {
  width: 80vw;
  height: 75vh;

  .title-part {
    height: 6vh;
    .flex-style(@justify: space-between);

    .title {
      font-size: 120%;
      font-weight: bold;
    }

    .ctrls {
      .flex-style(@justify: end);
      margin-right: 2vw;
      gap: 2vw;

      .iconfont {
        font-size: 120%;
        position: relative;
        .btn-style();
      }
    }
  }

  .main {
    width: 100%;
    height: 63vh;
    padding: 1vw;
  }
}
</style>
