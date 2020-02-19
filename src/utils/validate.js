// 1. 导入localize模块函数
import { extend, localize } from 'vee-validate'
// 导入全部的规则
import * as rules from 'vee-validate/dist/rules'

// 2.导入要使用的语言
import zhCN from 'vee-validate/dist/locale/zh_CN.json'

// 3.对导入好的语言做注册
localize({
  // 对象成员简易赋值
  zhCN
})
// 4. 使用具体的语言
localize('zhCN')
//
// 为校验手机号码，自定义规则
// phone:规则名称
// value:被校验的数据
extend('phone', {
  validate: value => {
    // return true  校验成功
    // return false 校验失败
    const reg = /^1[35789]\d{9}$/ // 正则校验手机号码
    return reg.test(value) // 正则匹配目标内容，返回boolean
  },
  // 校验失败的错误信息{_field_}代表被校验项目的name的名称
  message: '{_field_}格式不正确'
})

//

// 遍历、注册全部的规则
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})
