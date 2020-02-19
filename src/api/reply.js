// 回复 相关的请求函数
import request from '@/utils/request' // 引入封装的模块

// 回复的相关api函数

/**
 * 获取指定“评论”的所有回复信息
 * @param {评论id} commentID
 * @param {回复id} replyID
 * type:'c'  获取评论的回复信息
 * source：commentID   评论id，表示针对指定评论获得回复
 * offset: lastID  分页参数， 获取回复数据的偏移量，值为评论id，表示从此id的数据向后取，
 *                   不传表示从第一页开始读取数据
 * limit:10   每次返回10条评论信息
 * 注意：只有 source 和 offset 需要业务上做处理，type和limit是固定内容，不用处理
 */
export function apiReplyList({ commentID, lastID }) {
  return request({
    url: '/app/v1_0/comments',
    method: 'get',
    params: {
      type: 'c',
      source: commentID,
      offset: lastID,
      limit: 10
    }
  })
}
