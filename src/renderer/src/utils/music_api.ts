import { useStore, useMusicStore } from '@renderer/store/store'
import { storeToRefs } from 'pinia'
import { matchMusic, findMusic, addListener, read } from './engine'

let audio: HTMLAudioElement

/**
 * 切换音乐
 * @param {string} type 切换的类型
 */
function changeMusic(type: string): void {
  const { ordinal, list, manner, quality } = storeToRefs(useMusicStore())
  if (!list.value.length) list.value = read('music_info', true)
  const func = {
    next: () => (ordinal.value = ordinal.value === list.value.length - 1 ? 0 : ordinal.value + 1),
    prev: () => (ordinal.value = ordinal.value === 0 ? list.value.length - 1 : ordinal.value - 1)
  }
  func[type]()
  const playManner = {
    online: () => matchMusic(list.value[ordinal.value], quality.value),
    local: () => findMusic(list.value[ordinal.value], list.value)
  }
  playManner[manner.value]()
}

const ctrl = {
  load: () => {
    const { playingMsg } = storeToRefs(useStore())
    audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audio.src = playingMsg.value.url
    addListener(audio)
  },
  play: (data?: { [key: string]: any }, type: string = 'local'): any => {
    if (audio === undefined) ctrl.load()
    if (!data || !type) return audio.play()
    const func = {
      online: () => (audio.src = data.url),
      local: () => {
        const { localMusicPath, playingMsg } = storeToRefs(useStore())
        const url = `${localMusicPath.value}\\${data.url}`
        data.url = url
        playingMsg.value.img = ''
        playingMsg.value.lyrics = ''
        Object.assign(playingMsg.value, data)
        audio.src = playingMsg.value.url
      }
    }
    func[type]()
    audio.play()
  },
  pause: (): void => audio.pause(),
  next: (): void => changeMusic('next'),
  prev: (): void => changeMusic('prev'),
  volume: (val: number): void => {
    const { volume } = storeToRefs(useMusicStore())
    audio.volume = Number(val)
    volume.value = Number(val)
  },
  mode: (): boolean => (audio.loop = !audio.loop),
  progress: (val: number): number => (audio.currentTime = val),
  speed: (val: number): number => (audio.playbackRate = val)
}

export default ctrl
