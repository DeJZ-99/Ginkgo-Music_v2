import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  dialog,
  Notification,
  Tray,
  Menu,
  nativeTheme
} from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'node:fs'
import path from 'node:path'
import icon from '../../resources/favicon.ico?asset'

app.setName('Ginkgo Music')

function createMainWindow(): void {
  const option: Electron.BrowserWindowConstructorOptions = {
    show: false,
    frame: false,
    width: 900,
    height: 670,
    icon: icon,
    title: 'Ginkgo Music',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  }
  const win: BrowserWindow = new BrowserWindow(option)

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('Ginkgo Music')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createMainWindow()
  createTray()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

// 限制访问协议
app.on('web-contents-created', (_event, contents) => {
  // 阻止导航到不受信任的URL
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    // 阻止导航到非https或file协议的URL
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'file:') {
      event.preventDefault()
    }
  })
})

// 关闭所有窗口时退出应用程序
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 设置主题
ipcMain.on('theme:set', (_event, options) => (nativeTheme.themeSource = options))

// 窗口控制
ipcMain.on('window:ctrl', (event, options) => {
  const mainWindow = BrowserWindow.getAllWindows()[0]
  const type = {
    min: () => mainWindow?.minimize(),
    close: () => {
      event.preventDefault()
      mainWindow?.hide()
      createNotification({
        title: '提示',
        body: '程序已最小化到托盘'
      })
    }
  }
  type[options]?.()
})

// 选择路径
ipcMain.handle('file:url', () => {
  return dialog.showOpenDialogSync({
    properties: ['openDirectory'],
    title: '选择路径',
    buttonLabel: '确定'
  })
})

// 移动文件
ipcMain.handle('move:file', (_event, options) => {
  const option = JSON.parse(options)
  const { src, dest } = option
  let musicList: string[] = readFile(src)
  let status: boolean = false
  if (musicList.length === 0) return false
  musicList.forEach((item, index) => {
    fs.renameSync(path.join(`${src}/${item}`), path.join(`${dest}/${item}`))
    if (index == musicList.length - 1) status = true
  })
  return status
})

// main 打开外部链接
ipcMain.on('open:link', (_event, url) => shell.openExternal(url))

// 获取音乐列表
ipcMain.handle('get:list', (_event, url) => {
  return JSON.stringify(readFile(JSON.parse(url)))
})

// 监听网络状态
ipcMain.on('network:status', (_event, option) => {
  const { status, message } = JSON.parse(option)
  createNotification({
    title: status ? '提示' : '警告',
    body: message
  })
})

// 读取文件夹下的文件
function readFile(url: string): string[] {
  return fs
    .readdirSync(path.join(`${url}`))
    .filter((item) => item.endsWith('.mp3') || item.endsWith('.flac'))
}

/**
 * 创建通知
 * @param options 通知选项
 * @returns void
 */
function createNotification(options: Electron.NotificationConstructorOptions): void {
  const option = {
    ...options,
    icon
  }
  new Notification(option).show()
}

/**
 * 创建托盘
 * @returns void
 */
function createTray(): void {
  const mainWindow = BrowserWindow.getAllWindows()[0]
  const menu = Menu.buildFromTemplate([
    {
      label: '打开',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: '退出',
      click: () => {
        mainWindow.destroy()
        app.quit()
      }
    }
  ])
  const tray = new Tray(path.join(__dirname, '../../resources/favicon.ico'))
  tray.setToolTip('Ginkgo Music')
  tray.setContextMenu(menu)
}
