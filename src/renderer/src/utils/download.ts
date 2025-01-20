import { createApp, reactive } from 'vue'
import Download from '@renderer/components/Download.vue'

interface Data {
  songname?: string
  singer?: string
}

interface Func {
  show: (val: Data) => void
  hide: () => void
}

const data = reactive<Data>({
  songname: '',
  singer: ''
})

const downloadTab = createApp(Download, { data }).mount(document.createElement('div'))
const download: Func = {
  show: (val: Data) => {
    data.songname = val.songname
    data.singer = val.singer
    document.body.appendChild(downloadTab.$el)
  },
  hide: () => {
    document.body.removeChild(downloadTab.$el)
  }
}

export default download
