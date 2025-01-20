import { createApp, reactive } from 'vue'
import Dialog from '@renderer/components/Dialog.vue'

interface Info {
  msg: string
  status: boolean
}

interface Message {
  show: (val: string, status?: boolean) => void
  hide: () => void
}

const data: Info = reactive({
  msg: '',
  status: true
})

const dialogTab = createApp(Dialog, { data }).mount(document.createElement('div'))
const dailog: Message = {
  show(val: string, status?: boolean) {
    data.msg = val
    if (status !== undefined) data.status = status
    document.body.appendChild(dialogTab.$el)
  },
  hide() {
    document.body.removeChild(dialogTab.$el)
  }
}

export default dailog
