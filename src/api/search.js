import request from '@/utils/request'
/**
 * 根据联想关键字 搜索文章
 * @param {联想的关键字} q
 * @param {页码} page
 * @param {返回内容条数} per_page
 */
export function apiSearchList({ q, page = 1, per_page = 10 }) {
  return request({
    url: '/app/v1_0/search',
    method: 'get',
    params: {
      q,
      page,
      per_page
    }
  })
}

/**
 * 获得联想建议数据
 * @param {联想的关键字} q
 */
export function apiSuggestionList({ q }) {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'get',
    params: {
      q
    }
  })
}
