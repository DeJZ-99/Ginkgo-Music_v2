import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 自定义 API 用于渲染器
const api: object = {
  send: (channel: string, data: any): void => {
    ipcRenderer.send(channel, data)
  },
  invoke: (channel: string, data: any): Promise<any> => {
    return ipcRenderer.invoke(channel, data)
  }
}

// 如果上下文隔离启用，则使用 contextBridge API 将 Electron API 暴露给渲染器，否则将其添加到 DOM 全局变量中。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
