import { useStore, useBtnStore, useMusicStore, useGrooveStore } from '@renderer/store/store'
import { storeToRefs } from 'pinia'
import { matchMusicApi } from './api'
import ctrl from './music_api'
import dialog from './dialog'
import getURL from './data_url'
import axios from 'axios'

interface Figures {
  songname: string
  singer: string
}

/**
 * 监听网络状态，并发送给主进程
 * @param {boolean} status 网络状态
 * @param {string} message 网络状态消息
 * @returns void
 */
function sendNetworkStatus(status: boolean, message: string): void {
  const data = { status, message }
  window.api.send('network:status', JSON.stringify(data))
}
window.addEventListener('online', () => sendNetworkStatus(true, '网络连接成功！'))
window.addEventListener('offline', () => sendNetworkStatus(false, '网络连接断开！'))

/**
 * 去除字符串中的空格，换行符，制表符等字符
 * @param {string} str 字符串
 * @return {string} 去除后的字符串
 */
const _str = (str: string): string => str.trim().replace(/\s/g, '')

/**
 * 数据处理函数
 * @param {object} data 需要处理的数据
 * @param {string} type 处理类型
 * @returns 处理后的数据
 */
function handleFigures(data: Array<any>, type: string): Array<any> {
  const _handle = (list: any[]) =>
    list.map((item) => ({
      songname: item.title || item.song_title || item.SongName || item.name,
      singer: item.singer || item.song_singer || item.SingerName || item.author
    }))

  const handle = {
    search: () => _handle(data),
    play: () => _handle(data),
    download: () => _handle(data),
    info: () => _handle(data),
    hot: () =>
      data.map((item) => ({
        imgurl: item.imgurl.replace(/{size}/g, '480'),
        songs: item.songs.map((item: any) => {
          const info = item.filename.split('-')
          return {
            singer: info[0],
            songname: info[1]
          }
        }),
        specialname: item.specialname,
        intro: item.intro
      })),
    rank: () =>
      data.map((item) => ({
        rankname: item.rankname,
        frequency: item.update_frequency,
        update: item.rank_id_publish_date,
        img_url: item.album_img_9.replace(/{size}/g, '480'),
        songs: _handle(item.songinfo)
      }))
  }
  return handle[type]?.()
}

/**
 * 存储数据
 * @param {string} name 存储的名称
 * @param {any} data 存储的数据
 * @param {boolean} status 是否需要转换为字符串
 */
function save(name: string, data: any, status: boolean = false): void {
  localStorage.setItem(name, status ? JSON.stringify(data) : data)
}

/**
 * 读取数据
 * @param {string} name 读取的名称
 * @param {boolean} status 是否需要转换为对象
 * @returns 读取的数据
 */
function read(name: string, status: boolean = false): any {
  const data = localStorage.getItem(name)
  if (!data) return
  return status ? JSON.parse(data) : data
}

/**
 * 防抖函数
 * @param {function} callback 回调函数
 * @param {number} delay 延迟时间
 * @returns 函数
 */
function debounce<T extends any[], R>(
  callback: (...args: T) => R,
  delay: number
): (...args: T) => void {
  let timer: NodeJS.Timeout | null = null
  return function (...args: T) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      callback.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {function} callback 回调函数
 * @param {number} delay 延迟时间
 * @returns 函数
 */
function throttle<T extends any[], R>(
  callback: (...args: T) => R,
  delay: number
): (...args: T) => void {
  let timer: NodeJS.Timeout | null = null
  return function (...args: T) {
    if (!timer) {
      timer = setTimeout(() => {
        callback.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

/**
 * 查找本地音乐中是否有该歌曲，如果有则播放，没有则进行在线音乐
 * @param info 音乐数据：歌曲名、歌手
 * @param list 本地音乐列表
 */
function findMusic(info: Figures, list: Figures[]) {
  const index = list.findIndex((el) => el.songname === info.songname && el.singer === info.singer)
  index !== -1
    ? ctrl.play({ ...info, url: read('music_list', true)[index] }, 'local')
    : matchMusic(info)
}

/**
 * 匹配音乐
 * @param {object} data 音乐数据：歌曲名、歌手
 * @param {string} quality 音质：NQ、HQ、SQ，默认NQ
 * @param {string} type 类型：play、download，默认play
 */
function matchMusic(data: Figures, quality: string = 'NQ', type: string = 'play'): void {
  const { url, keyword, br } = qualityToURL(quality)
  const { songname, singer } = data
  const value = `${songname} ${singer}`

  matchMusicApi(url, { [keyword]: value, br }).then((res) => {
    if (res.data === null) return dialog.show('音乐库中没有该歌曲')

    const index = matchOrdinal(data, res.data.data, type)
    if (index === null) return dialog.show('该歌曲没有版权')

    matchMusicApi(url, { [keyword]: value, br, index }).then((res) => {
      type === 'download' ? downloadMusic(data, res, quality) : playOnlineMusic(data, res, type)
    })
  })
}

/**
 * 根据音质获取对应的URL
 * @param {string} type 音质：NQ、HQ、SQ
 * @returns {object} URL
 */
function qualityToURL(type: string): { [key: string]: any } {
  const _func = (): { [key: string]: string } => ({
    url: getURL('better_play'),
    keyword: 'msg'
  })
  const func = {
    NQ: () => ({
      url: getURL('play'),
      keyword: 'gm',
      br: null
    }),
    HQ: () => ({ ..._func(), br: 2 }),
    SQ: () => ({ ..._func(), br: 1 })
  }
  return func[type]()
}

/**
 * 在线音乐播放引擎
 * @param {object} value 音乐数据：歌曲名、歌手
 * @param {object} res 音乐数据
 */
function playOnlineMusic(value: Figures, res: any, type): void {
  const { playingMsg } = storeToRefs(useStore())
  const { songname, singer } = value
  const info = res.data
  const data = {
    songname,
    singer,
    url: info.music_url || info.data.music_url,
    img: info.cover || info.data.cover,
    lyrics: info.lyrics || info.data.lyric
  }

  const func = {
    play: () => {
      Object.assign(playingMsg.value, data)
      ctrl.play(data, 'online')
    },
    info: () => Object.assign(playingMsg.value, { img: data.img, lyrics: data.lyrics })
  }
  func[type]?.()
}

/**
 * 音乐下载引擎
 * @param {object} value 音乐数据：歌曲名、歌手
 * @param {object} data 音乐数据
 * @param {string} quality 音质：NQ、HQ、SQ
 */
function downloadMusic(value: Figures, data: any, quality: string): void {
  const { downloadList } = storeToRefs(useStore())
  downloadList.value.push({ ...value, progress: 0 }) // 添加progress属性并初始化为0
  const { songname, singer } = value
  const url = data.data.music_url || data.data.data.music_url
  const format = quality === 'SQ' ? 'flac' : 'mp3'

  axios
    .get(url, {
      responseType: 'arraybuffer',
      onDownloadProgress: (progressEvent) => {
        if (!progressEvent.total) return
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        const itemIndex = downloadList.value.findIndex(
          (item) => item.songname === songname && item.singer === singer
        )
        if (itemIndex !== -1) {
          downloadList.value[itemIndex].progress = percentCompleted // 更新对应item的progress属性
        }
      }
    })
    .then((response) => {
      const blob = new Blob([response.data], { type: `audio/${format}` })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${songname} - ${singer}.${format}`
      link.click()
      URL.revokeObjectURL(link.href)
      // 下载完成后可以将progress设置为100%
      const itemIndex = downloadList.value.findIndex(
        (item) => item.songname === songname && item.singer === singer
      )
      if (itemIndex !== -1) {
        downloadList.value[itemIndex].progress = 100
      }
    })
    .catch((_error) => {
      console.log('下载失败:')
      // 下载失败后可以将progress设置为-1或其他表示失败的值
      const itemIndex = downloadList.value.findIndex(
        (item) => item.songname === songname && item.singer === singer
      )
      if (itemIndex !== -1) {
        downloadList.value[itemIndex].progress = -1
      }
    })
}

/**
 * 匹配序号：根据歌曲名和歌手匹配序号
 * @param {object} baseData 基础数据
 * @param {object} inputData 输入数据
 * @param {string} type 类型
 * @returns {number} 序号
 */
function matchOrdinal(baseData: Figures, inputData: Array<any>, type: string): number | null {
  const { songname, singer } = baseData
  const arr = handleFigures(inputData, type)
  const index = arr.findIndex(
    (item: { songname: string; singer: string }) =>
      Object.is(_str(item.songname), _str(songname)) && Object.is(_str(item.singer), _str(singer))
  )
  return index !== -1 ? index + 1 : null
}

/**
 * 时间戳转换为时间格式
 * @param {number} time - 时间戳
 * @returns {string} - 时间格式字符串
 */
function handleTime(time: number): string | undefined {
  if (isNaN(time)) return
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60)
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

/**
 * 处理歌词数据
 * @param {string} data 歌词原文本
 * @returns {object} 处理后包含时间戳和词的歌词对象 { [key: string]: string }
 */
function handleWords(data: string): { [key: string]: string } {
  // 获取有效的歌词文本
  const valid: string = validText(data)
  // 获取时间文本和歌词文本
  const [timePart, wordsPart]: [number[], string[]] = [timeText(valid), wordsText(valid)]
  // 将timePart和wordsPart合并为一个对象，key为时间戳，value为歌词，并返回
  return timePart.reduce(
    (lyric, time, index) => {
      lyric[time] = wordsPart[index]
      return lyric
    },
    {} as { [key: string]: string }
  )
}

/**
 * 获取有效的歌词文本
 * @param {string} data 歌词原文本
 * @returns {string} 有效的歌词文本
 */
function validText(data: string): string {
  // 检查字符串中是否存在 \\n ,如果存在则将 \\n 替换为 \r\n
  data = data.replace(/\\n/g, '\r\n')
  const offsetMatch: RegExpMatchArray | null = data.match(/\[offset:(-?\d+)\]/)
  const byMatch: RegExpMatchArray | null = data.match(/\[by:[^\]]*\]/)
  return offsetMatch ? data.split(offsetMatch[0])[1] : byMatch ? data.split(byMatch[0])[1] : data
}

/**
 * 获取时间文本, 将格式为 [mm:ss.xx] 的时间文本提取出来，并转化为秒数
 * @param {string} data 歌词原文本
 * @returns {string[]} 时间文本数组
 */
function timeText(data: string): number[] {
  const timeMatch: RegExpMatchArray | [] = data.match(/\[\d{2}:\d{2}\.\d{2}\]/g) || []
  return timeMatch.map((item: any) => {
    const [minutes, seconds]: string[] = item.match(/\d{2}:\d{2}\.\d{2}/)[0].split(':')
    const milliseconds: string = seconds.split('.')[1]
    return Math.floor(Number(minutes) * 60 + Number(seconds) + Number(milliseconds) / 100)
  })
}

/**
 * 获取歌词文本, 将歌词文本中的时间文本去掉
 * @param {string} data 歌词原文本
 * @returns {string[]} 歌词文本数组
 */
function wordsText(data: string): string[] {
  type StringMap = '\r\n' | '\n' | ''
  const _in = (reg: string): boolean => wordMatch.includes(reg)
  // 去掉时间文本
  const wordMatch: string = data.replace(/\[\d{2}:\d{2}\.\d{2}\]/g, '')
  // 判断字符串中是否存在 \r\n 或 \n
  const lineDelimiter: StringMap = _in('\r\n') ? '\r\n' : _in('\n') ? '\n' : ''
  const lines: string[] = lineDelimiter ? wordMatch.split(lineDelimiter) : [wordMatch]
  // 去掉lines数组中为空的元素
  return lines.filter((item) => item !== '')
}

/**
 * 监听音频事件
 * @param {HTMLAudioElement} audio - 音频元素
 * @returns {void}
 */
function addListener(audio: HTMLAudioElement): void {
  const { playStopBtnStatus } = storeToRefs(useBtnStore())
  const { currentTime, duration, volume, speed } = storeToRefs(useMusicStore())
  const { imgRotate, ISINIT, analyser, bufferLength, dataArray } = storeToRefs(useGrooveStore())

  audio.addEventListener('ended', () => ctrl.next())
  audio.addEventListener('play', () => {
    playStopBtnStatus.value = true
    imgRotate.value = 'running'
    audio.volume = volume.value
    audio.playbackRate = speed.value

    // 音乐律动
    if (ISINIT.value) return
    const audioContext: AudioContext = new AudioContext()
    const source: MediaElementAudioSourceNode = audioContext.createMediaElementSource(audio)
    analyser.value = audioContext.createAnalyser()
    source.connect(analyser.value)
    analyser.value.connect(audioContext.destination)
    bufferLength.value = ((analyser.value.frequencyBinCount * 44100) / audioContext.sampleRate) | 0
    dataArray.value = new Uint8Array(bufferLength.value)
    ISINIT.value = true
  })
  audio.addEventListener('pause', () => {
    playStopBtnStatus.value = false
    imgRotate.value = 'paused'
  })
  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime
    duration.value = audio.duration
  })
}

export {
  save,
  read,
  debounce,
  throttle,
  handleFigures,
  handleWords,
  findMusic,
  matchMusic,
  handleTime,
  addListener
}
