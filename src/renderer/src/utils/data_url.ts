interface Path {
  [key: string]: string
}

interface PathBox {
  [key: string]: Path
}

const commonPaths: Path = {
  github: 'https://github.com/DeJZ-99',
  qq: 'tencent://message/?uin=2927425510&Site=&Menu=yes'
}

const paths: PathBox = {
  development: {
    play: '',
    better_play: '',
    search: '',
    hotmsg: '/hotmsg/api/v5/special/recommend',
    rank: '/rank/rank/list',
    pic: '/pic/kmr/v1/author/extend',
    ...commonPaths
  },
  production: {
    play: '',
    better_play: '',
    search: '',
    hotmsg: 'http://mobilecdnbj.kugou.com/api/v5/special/recommend',
    rank: 'https://m.kugou.com/rank/list',
    pic: 'https://openapicdnretry.kugou.com/kmr/v1/author/extend',
    ...commonPaths
  }
}

/**
 * 获取路径
 * @param {string} type 类型
 * @returns {string} 路径
 */
const getURL = (type: string): string => paths[import.meta.env.MODE][type]

export default getURL
