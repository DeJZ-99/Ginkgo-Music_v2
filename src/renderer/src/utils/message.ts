import { createApp, reactive } from 'vue'
import Message from '@renderer/components/Message.vue'

interface MessageDatas {
  msg: string
  width?: number
  height?: number
  x?: number
  y?: number
  dir?: string
}

interface MessageInstance {
  show: (datas: MessageDatas) => void
  hide: () => void
}

const data = reactive<MessageDatas>({
  msg: '',
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  dir: ''
})

const MessageTab = createApp(Message, { data }).mount(document.createElement('div'))
const message: MessageInstance = {
  show(val) {
    Object.assign(data, val)
    document.body.appendChild(MessageTab.$el)
  },
  hide() {
    document.body.removeChild(MessageTab.$el)
  }
}

export default message
