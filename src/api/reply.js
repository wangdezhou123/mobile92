// 回复 相关的请求函数
import request from '@/utils/request' // 引入封装的模块

// 回复的相关api函数

/**
 * 添加评论或回复信息 (接口：【添加评论或评论回复】)
 * @param {*} target 文章或评论的id（评论文章即为 文章id，对评论进行回复则为 评论id）
 * @param {*} content 评论或回复的内容
 * @param {*} art_id 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。
 *                    对文章进行评论，不要传此参数
 * C:comment评论
 * R:reply回复
 */
export function apiAddCorR({ target, content, art_id = null }) {
  return request({
    url: '/app/v1_0/comments',
    method: 'POST',
    data: {
      target,
      content,
      art_id
    }
  })
}

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
