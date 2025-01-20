import { ElectronAPI } from '@electron-toolkit/preload'

// 定义全局变量
declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

// 定义API接口
interface API {
  [key: string]: (channel: string, data: any) => any
}
