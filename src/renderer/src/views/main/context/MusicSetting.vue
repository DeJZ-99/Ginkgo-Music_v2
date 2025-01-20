<template>
    <div class="music-setting">
        <div class="set-theme">
            <div class="theme-name">
                <span>当前主题：</span>
                <span class="name">{{ themeName }}</span>
            </div>
            <div class="theme-item">
                <span @click="changeTheme('light')">简约白</span>
                <span @click="changeTheme('dark')">简约黑</span>
                <span @click="changeTheme('light_colorful')">炫彩亮</span>
                <span @click="changeTheme('dark_colorful')">炫彩暗</span>
            </div>
        </div>
        <div class="set-path">
            <div class="download">
                <label for="download-url">需要移动的文件夹：</label>
                <input type="text" id="download-url" v-model="downloadValue" placeholder="例如：C:/Downloads">
                <span class="select" @click="selectFile('download')">选择</span>
            </div>
            <div class="target">
                <label for="target-url">目标文件夹：</label>
                <input type="text" id="target-url" v-model="targetValue" placeholder="例如：C:/Music">
                <span class="select" @click="selectFile('muisc')">选择</span>
                <span class="move" @click="moveFile">开始移动</span>
            </div>
        </div>
        <div class="set-link">
            <span class="author">联系作者：</span>
            <span class="iconfont" @click="linkAuthor('github')">&#xea0b;</span>
            <span class="iconfont" @click="linkAuthor('qq')">&#xe66a;</span>
        </div>
        <div class="set-quality">
            <div class="quality-name">
                <span>播放音质：</span>
                <span class="name">{{ qualityName }}</span>
            </div>
            <div class="quality-item">
                <span @click="changeQuality('NQ')">标准音质</span>
                <span @click="changeQuality('HQ')">高品音质</span>
                <span @click="changeQuality('SQ')">无损音质</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { useStore, useThemeStore, useMusicStore } from '@renderer/store/store';
import { storeToRefs } from 'pinia';
import { read, save } from '@renderer/utils/engine';
import getURL from '@renderer/utils/data_url';
import dialog from '@renderer/utils/dialog';


const store = useStore();
const themeStore = useThemeStore();
const { titleName, localMusicPath } = storeToRefs(store);
const { themeName, theme, } = storeToRefs(themeStore);
const { quality, qualityName } = storeToRefs(useMusicStore());
const downloadValue: Ref<string> = ref(read('download_url') || '');
const targetValue: Ref<string> = ref(read('muisc_url') || '');

interface ItemFunction {
    [key: string]: any
}

const changeTheme = (name: string): string => theme.value = name;

const selectFile = async (type: string): Promise<any> => {
    const path: string = await window.api.invoke('file:url', type);
    if (!path) return;
    const func: ItemFunction = {
        download: () => downloadValue.value = path,
        muisc: async () => {
            targetValue.value = path;
            localMusicPath.value = path;
        }
    }
    func[type]();
    save(`${type}_url`, path);
}

const moveFile = async (): Promise<any> => {
    if (!downloadValue.value) return dialog.show('请选择需要移动的文件夹');
    if (!targetValue.value) return dialog.show('请选择目标文件夹');
    const options: { [key: string]: any } = {
        src: downloadValue.value,
        dest: targetValue.value
    };
    const result: boolean = await window.api.invoke('move:file', JSON.stringify(options));
    result === true ? dialog.show('移动成功') : dialog.show('没有可移动文件');
}

const linkAuthor = (type: string): void => {
    const func: ItemFunction = {
        github: () => getURL('github'),
        qq: () => getURL('qq')
    }
    const path: string = func[type]();
    window.api.send('open:link', path);
}

const changeQuality = (name: string): string => quality.value = name;

onMounted((): string => titleName.value = "系统设置")
</script>

<style lang="less" scoped>
.music-setting {
    font-size: 90%;

    .set-theme,
    .set-quality {
        .flex-style(@justify: normal, @align: normal, @column: column);
        gap: 2vw;
        margin-bottom: 2vw;

        .theme-item,
        .quality-item {
            display: flex;
            gap: 2vw;

            span {
                font-size: 90%;
                .btn-style(@s: 0.8vh);
            }
        }
    }

    .set-path {
        .flex-style(@justify: normal, @align: normal, @column: column);
        gap: 1vw;
        margin-top: 3.5vw;
        margin-bottom: 4vw;

        span {
            font-size: 90%;
            margin-left: 1vw;
            .btn-style(@s: 0.8vh);
        }

        input {
            .input-style();
            .radius-transition();
            outline: none;
            border: none;
            text-indent: 0.3em;
            padding: 1vh;
        }

        &>div {
            display: flex;
            align-items: center;
        }
    }

    .set-link {
        .iconfont {
            font-size: 110%;
            .btn-style();
            margin-right: 1vw;
        }
    }

    .set-quality {
        margin-top: 4vw;
    }
}
</style>