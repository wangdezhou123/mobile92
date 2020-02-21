// 导入axios模块
import request from '@/utils/request.js'

// 创建各种api方法

/**
 * 上传用户头像
 * @param {FormData对象，拥有photo成员，代表被上传头像的文件对象} fdObj
 * FormData是html5发布的技术
 * 可以实现普通表单域信息 和 上传文件域信息的收集工作
 */
export function apiUserPhoto(fdObj) {
  return request({
    url: '/app/v1_0/user/photo', // 编辑头像的地址
    method: 'patch', // 设置头像的类型
    data: fdObj
  })
}

/**
 * 获取用户个人资料
 */
export function apiUserProfile() {
  return request({
    url: '/app/v1_0/user/profile', // 地址
    method: 'get'
  })
}


/**
 * api:获取用户自己信息
 * 接口文档的目标id 不用传->忽略
 * 接口：【获取用户自己信息】
 */
export const apiUserInfo = () => {
  return request({
    url: `/app/v1_0/user`,
    method: 'GET'
  })
}


/**
 * 关注作者
 * @param {target} 被关注用户id
 */
export function apiUserFollow(target) {
  return request({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      // 成员简易赋值
      target
    }
  })
}

/**
 * 取消关注作者
 * @param {target} 取消关注用户id
 */
export function apiUserUnFollow(target) {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/followings/${target}`
  })
}


/**
 * 对登录账户信息进行校验，是一个es6按需导出动作
 * 接口：【用户认证（登录注册）】
 * @param {手机号码} mobile
 * @param {验证码} code
 * 不用看接口文档，改造如下接口方结构，使得参数可以看出来，提升开发效率
 * data: {mobile:xx,code:xx}
 * 给data做对象解构赋值 es6语法结构
 * 业务组件应用(与之前套路一致)：apiUserLogin({mobile:'13922223333',code:222333})
 *
 * 经过如下设计，及时没有任何注释说明，我们也知道该接口需要哪些参数，太妙了
 */
export function apiUserLogin({ mobile, code }) {
  // 请求axios，request就是axios的复制品，操作结构完全一致
  // return 返回执行结果，是promise对象
  return request({
    url: '/app/v1_0/authorizations',
    method: 'post',
    data: {
      // 对象成员简易赋值
      mobile, // mobile:mobile
      code // code:code
    }
    // params: get请求成员标志
    // data: 非get请求成员标志
  })
}
