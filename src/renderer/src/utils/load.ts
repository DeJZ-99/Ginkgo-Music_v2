import { createApp, reactive } from 'vue'
import Loading from '@renderer/components/Loading.vue'

interface MsgType {
  show: boolean
}

interface LoadInstance {
  show: () => void
  hide: () => void
}

const msg: MsgType = reactive({
  show: false
})

const loading = createApp(Loading, { msg }).mount(document.createElement('div'))
const load: LoadInstance = {
  show() {
    msg.show = true
    document.body.appendChild(loading.$el)
  },
  hide() {
    msg.show = false
    document.body.removeChild(loading.$el)
  }
}

export default load
