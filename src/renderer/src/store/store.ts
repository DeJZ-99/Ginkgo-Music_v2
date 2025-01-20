import { defineStore } from 'pinia'
import { reactive, ref, watch, watchEffect } from 'vue'
import { save, read } from '../utils/engine'

type ThemeName = '跟随系统' | '简约白' | '简约黑' | '炫彩白' | '炫彩黑'

const useThemeStore = defineStore('theme', () => {
  const theme = ref<string>(read('theme') || 'light')
  const themeName = ref<ThemeName>()
  const themeFontColor = ref<string>('')

  const getThemeName = (name: string): ThemeName => {
    const type = {
      system: () => '跟随系统',
      light: () => '简约白',
      dark: () => '简约黑',
      light_colorful: () => '炫彩亮',
      dark_colorful: () => '炫彩暗'
    }
    return type[name]()
  }

  watchEffect(() => {
    document.documentElement.dataset.theme = theme.value
    save('theme', theme.value)
    themeName.value = getThemeName(theme.value)
    themeFontColor.value = window.getComputedStyle(document.body).color

    const isDark: boolean = theme.value.includes('dark')
    window.api.send('theme:set', isDark ? 'dark' : 'light')
  })

  return { theme, themeName, themeFontColor }
})

type TitleName = '搜索结果' | '热门音乐' | '音乐排行榜' | '下载列表' | '本地音乐' | '系统设置'
interface MusicMsg {
  songname: string
  singer: string
  img: string
  url: string
  lyrics: string
}

const useStore = defineStore('store', () => {
  // 页面标题
  const titleName = ref<TitleName>()

  // 搜索结果列表
  const searchMusic = ref<Array<any>>([])
  // 搜索结果列表的dom元素
  const searchItem = ref<HTMLDivElement>()
  // 热门音乐
  const hotMusic = ref<Array<any>>([])
  // 音乐排行榜
  const rankMusic = ref<Array<any>>([])
  // 本地音乐列表
  const localMusic = ref<Array<any>>(read('music_info', true) || [])
  // 我喜欢的音乐列表
  const likeMusic = ref<Array<any>>(read('like_music', true) || [])
  // 下载列表
  const downloadList = ref<Array<any>>([])
  // 存放本地音乐列表的文件夹路径
  const localMusicPath = ref<string>(read('muisc_url') || '')
  // 暂存正在播放的音乐的数据
  const playingMsg = reactive<MusicMsg>({
    songname: '',
    singer: '',
    img: '',
    url: '',
    lyrics: ''
  })
  // 上一页的路径
  const prePath = ref<string>('')
  // 音乐列表的dom元素
  const musicItems = ref<NodeListOf<HTMLDivElement>>()

  watchEffect(() => {
    // console.log(read('play_info', true))
    const info = read('play_info', true)
    if (info) Object.assign(playingMsg, info)
  })
  watch(
    () => playingMsg.songname,
    () => {
      save('play_info', playingMsg, true)
    }
  )

  return {
    titleName,
    searchMusic,
    searchItem,
    hotMusic,
    rankMusic,
    localMusic,
    likeMusic,
    downloadList,
    localMusicPath,
    playingMsg,
    prePath,
    musicItems
  }
})

const useBtnStore = defineStore('btn', () => {
  // 侧边栏按钮的状态
  const sideBarBtnStatus = ref<boolean[]>([true, false, false, false, false])
  // 按钮状态：返回、删除、刷新、定位、返回顶部、歌词搜索
  const backStatus = ref<boolean>(false)
  const delStatus = ref<boolean>(false)
  const refreshStatus = ref<boolean>(false)
  const locatingStatus = ref<boolean>(false)
  const backTopStatus = ref<boolean>(false)
  const lyricStatus = ref<boolean>(false)
  const initBtnStatus = (): void => {
    backStatus.value = false
    delStatus.value = false
    refreshStatus.value = false
    locatingStatus.value = false
    backTopStatus.value = false
  }

  // 播放、暂停按钮的状态
  const playStopBtnStatus = ref<boolean>(false)
  // 音量按钮的状态
  const volumeBtnStatus = ref<boolean>(false)
  // 播放模式按钮的状态
  const playModeBtnStatus = ref<boolean>(false)

  return {
    sideBarBtnStatus,
    backStatus,
    delStatus,
    refreshStatus,
    locatingStatus,
    backTopStatus,
    lyricStatus,
    initBtnStatus,
    playStopBtnStatus,
    volumeBtnStatus,
    playModeBtnStatus
  }
})

const useMusicStore = defineStore('music', () => {
  // 正在播放的音乐列表
  const list = ref<Array<any>>([])
  // 正在播放的音乐的序号
  const ordinal = ref<number>(0)
  // 正在播放的音乐的总时长：格式为时间戳
  const duration = ref<number>(0)
  // 正在播放的音乐的当前播放时间：格式为时间戳
  const currentTime = ref<number>(0)
  // 播放音量
  const volume = ref<number>(read('volume') || 1)
  // 播放速度
  const speed = ref<number>(1)
  // 播放方式：在线播放online、本地播放local
  const manner = ref<string>('local')
  // 播放在线音乐的品质
  const quality = ref<string>(read('quality') || 'NQ')
  // 音质名称
  const qualityName = ref<string>('')

  const getQualityName = (name: string): string => {
    const type = {
      SQ: () => '无损音质',
      HQ: () => '高品音质',
      NQ: () => '标准音质'
    }
    return type[name]()
  }

  watchEffect(() => {
    if (volume.value !== 0) save('volume', volume.value)
    qualityName.value = getQualityName(quality.value)
    save('ordinal', ordinal.value)
    save('speed', speed.value)
    save('manner', manner.value)
    save('quality', quality.value)
    save('time', currentTime.value)
  })

  return {
    list,
    ordinal,
    duration,
    currentTime,
    volume,
    speed,
    manner,
    quality,
    qualityName
  }
})

const useGrooveStore = defineStore('groove', () => {
  // 图片旋转状态
  const imgRotate = ref<'paused' | 'running'>('paused')
  // 律动初始化状态
  const ISINIT = ref<boolean>(false)
  // 音频分析器
  const analyser = ref<any>({})
  // 音频分析器的数据
  const dataArray = ref<Uint8Array>()
  // 音频分析器的数据长度
  const bufferLength = ref<number>(0)

  return {
    imgRotate,
    ISINIT,
    analyser,
    dataArray,
    bufferLength
  }
})

export { useStore, useMusicStore, useBtnStore, useThemeStore, useGrooveStore }
