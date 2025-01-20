import service from './request'

/**
 * 搜索音乐
 * @param {string} URL 路径
 * @param {string} keyword 关键词:音乐名、歌手名、音乐名+歌手名
 * @returns {Promise} 返回的Promise对象：成功返回数据、失败返回错误信息
 */
function searchMusicApi(URL: string, keyword: string): Promise<{ data: any }> {
  // URL:/search/song_search_v2
  return service({
    url: URL,
    method: 'get',
    params: {
      keyword,
      platform: 'WebFilter',
      format: 'json',
      page: 1,
      pagesize: 200
    }
  })
}

/**
 * 热门音乐
 * @param {string} URL 路径
 * @returns {Promise} 返回的Promise对象：成功返回数据、失败返回错误信息
 */
function hotMusicApi(URL: string): Promise<{ data: any }> {
  // URL:/hotmsg/api/v5/special/recommend
  return service({
    url: URL,
    method: 'get',
    params: {
      recommend_expire: 0,
      sign: '52186982747e1404d426fa3f2a1e8ee4',
      plat: 0,
      uid: 0,
      version: 9108,
      page: 1,
      area_code: 1,
      appid: 1005,
      mid: '286974383886022203545511837994020015101',
      _t: 1545746286
    }
  })
}

/**
 * 排行榜音乐
 * @param {string} URL 路径
 * @returns {Promise} 返回的Promise对象：成功返回数据、失败返回错误信息
 */
function rankMusicApi(URL: string): Promise<{ data: any }> {
  return service({
    url: URL,
    method: 'get',
    params: {
      json: 'true'
    }
  })
}

/**
 * 获取音乐
 * @param {string} URL 路径
 * @param {Object} options 参数对象
 * @param {string} options.gm 标准音质的关键字：歌名、歌手名、音乐名+歌手名
 * @param {string} options.msg 超高音质和无损音质的关键字
 * @param {string} options.index 音乐索引：无值时，返回音乐数据列表、有值时，返回音乐数据列表中的某一条数据
 * @param {string} options.br 音乐音质：默认为null,2为超高音质、3为无损音质
 * @returns {Promise} 音乐数据
 */

interface Options {
  gm?: string
  msg?: string
  index?: string | number
  br?: number | null
}

function matchMusicApi(URL: string, options: Options): Promise<{ data: any }> {
  // 标准音质URL：/play/api/dg_kgmusic.php
  // 超高音质URL,无损音质URL：/play/api/dg_shenmiMusic_SQ.php
  const { gm, msg, index = '', br = 1 } = options
  return service({
    url: URL,
    method: 'get',
    params: {
      gm,
      msg,
      br,
      type: 'json',
      n: index
    }
  })
}

/**
 * 获取歌手id
 * @param {string} URL 路径
 * @param {string} keyword 关键词:音乐名、歌手名、音乐名+歌手名
 * @returns {Promise} 歌手id
 */
function singerIdApi(URL: string, value: string): Promise<any> {
  // URL:/search/song_search_v2
  return service({
    url: URL,
    method: 'get',
    params: {
      keyword: value,
      platform: 'WebFilter',
      format: 'json',
      page: 1,
      pagesize: 1
    }
  })
}

/**
 * 获取歌手写真
 * @param {string} URL 路径
 * @param {string} id 歌手id
 * @returns {Promise} 歌手写真
 */
function singerPictorialsApi(URL: string, id: string): Promise<{ data: any }> {
  // URL:/pic/kmr/v1/author/extend
  return service({
    url: URL,
    method: 'get',
    params: {
      fields_pack: 'allimages',
      authorimg_type: '1,3',
      entity_id: id
    }
  })
}

export {
  searchMusicApi,
  hotMusicApi,
  rankMusicApi,
  singerIdApi,
  singerPictorialsApi,
  matchMusicApi
}
