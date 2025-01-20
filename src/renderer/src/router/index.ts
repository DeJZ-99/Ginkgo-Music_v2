import { createRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'

// 定义路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'context',
    component: () => import('@renderer/views/Main.vue'),
    children: [
      {
        path: '',
        name: 'hot',
        component: () => import('@renderer/views/main/context/MusicHot.vue')
      },
      {
        path: 'rank',
        name: 'rank',
        component: () => import('@renderer/views/main/context/MusicRank.vue')
      },
      {
        path: 'download',
        name: 'download',
        component: () => import('@renderer/views/main/context/MusicDownload.vue')
      },
      {
        path: 'local',
        name: 'local',
        component: () => import('@renderer/views/main/context/MusicLocal.vue')
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@renderer/views/main/context/MusicSetting.vue')
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@renderer/views/main/context/MusicSearch.vue')
      },
      {
        path: 'match',
        name: 'match',
        component: () => import('@renderer/views/main/context/MatchPage.vue')
      }
    ]
  },
  {
    path: '/lyrics',
    name: 'lyrics',
    component: () => import('@renderer/views/Lyrics.vue'),
    children: [
      {
        path: 'groove',
        name: 'groove',
        component: () => import('@renderer/views/lyrics/Groove.vue')
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createMemoryHistory(),
  routes
})

// 导出路由实例
export default router
