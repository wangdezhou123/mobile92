// 导入axios模块
import request from '@/utils/request.js'

// 文章各种api创建

/**
 * 根据id获得文章详情信息
 * @param {文章id} articleID
 */
export function apiArticleDetail(articleID) {
  return request({
    url: '/app/v1_0/articles/' + articleID,
    method: 'get'
  })
}

/**
 * 对文章做举报处理
 * @param {文章id} articleID
 * @param {举报类型} type
 * 举报类型： 0-其他问题，1-标题夸张，2-低俗色情，3-错别字多，4-旧闻重复，5-广告软文，6-内容不实，
 * 7-涉嫌违法犯罪，8-侵权'
 * {articleID, type, remark=''} 是对象解构赋值用法，这样可以清楚知道当前接口需要哪些参数，
 * 不用再查看接口文档了，非常方便
 *
 * 对象解构赋值可以设置默认值  例如 remark=''
 */
export function apiArticleReport({ articleID, type, remark = '' }) {
  return request({
    url: '/app/v1_0/article/reports',
    method: 'post',
    data: {
      target: articleID,
      // 对象成员简易赋值，完整写法：type:type
      type,
      remark // 其他问题 的附加说明
    }
  })
}

/**
 * 对不感兴趣(不喜欢)的文章做处理
 * @param {文章id} articleID
 */
export function apiArticleDislike(articleID) {
  return request({
    url: '/app/v1_0/article/dislikes',
    method: 'post',
    data: {
      target: articleID
    }
  })
}

/**
 * 根据频道获得相关的文章列表信息
 * channel_id 频道ID
 * timestamp 时间戳整数 单位毫秒 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
 *           分页标志
 *           timestamp：当前时间戳  获得第1页数据(在返回的数据里边有pre_timestamp字段)
 *           timestamp=pre_timestamp  获得第2页数据(在返回的数据里边有pre_timestamp字段)
 *           timestamp=pre_timestamp  获得第3页数据(在返回的数据里边有pre_timestamp字段)
 *           ……
 *           timestamp要赋予上次返回数据里边的pre_timestamp字段内容，就代表获得下一页数据
 * with_top=1  0或1 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
 * 参数下边有红色波浪线，不用理会，eslint推荐变量名称使用小驼峰风格
 */
export function apiArticleList({ channel_id, timestamp }) {
  return request({
    url: '/app/v1_1/articles',
    method: 'get',
    params: {
      channel_id,
      timestamp,
      with_top: 1
    }
  })
}
