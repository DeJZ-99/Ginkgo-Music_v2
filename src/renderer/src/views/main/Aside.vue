<template>
    <div class="aside">
        <div class="menu-box">
            <span class="iconfont" v-for="(item, index) in menuItems" :key="index"
                @mouseover="showMsg(item.path, $event)" @mouseout="message.hide()" @click="linkPage(item.path)"
                :class="[item.icon, { active: sideBarBtnStatus[index] }]"></span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useBtnStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import message from '@renderer/utils/message';

const router = useRouter();
const route = useRoute();
const { sideBarBtnStatus } = storeToRefs(useBtnStore());
const { initBtnStatus } = useBtnStore();

interface MenuItem {
    path: string;
    icon: string;
}

const menuItems: MenuItem[] = [
    { path: 'hot', icon: 'icon-hotfill' },
    { path: 'rank', icon: 'icon-Ranking' },
    { path: 'download', icon: 'icon-download' },
    { path: 'local', icon: 'icon-backups' },
    { path: 'setting', icon: 'icon-setting' }
]

const linkPage = (path: string): void => {
    router.push({ name: path });
    if (path !== route.name) initBtnStatus();
    const index: number = menuItems.findIndex(item => item.path === path);
    sideBarBtnStatus.value.fill(false);
    sideBarBtnStatus.value[index] = true;
}

const showMsg = (pageName: string, event: Event): void => {
    const msgs = <{ [key: string]: string }>{
        hot: '热门音乐',
        rank: '音乐排行榜',
        download: '下载列表',
        local: '本地音乐',
        setting: '系统设置'
    }
    const msg: string = msgs[pageName];
    const tag: HTMLElement = event.target as HTMLElement;
    const { width, height, x, y } = tag.getBoundingClientRect();
    message.show({ msg, width, height, x, y, dir: 'right' });
}
</script>

<style lang="less" scoped>
.aside {
    width: 20vw;
    height: 75vh;
    .flex-style();

    .menu-box {
        width: 50%;
        height: 90%;
        border-radius: 3vw;
        .flex-style(@justify: space-evenly, @column: column);
        .box-shadow();

        .iconfont {
            font-size: 130%;
            position: relative;
            .btn-style();
        }

        .active {
            color: var(--font-active-color);
        }
    }
}
</style>