import { root } from './index'
const hyExt = global.hyExt

export const requestUserInfo = () => {
  return new Promise((resolve) => {
    hyExt.context.getStreamerInfo().then(userInfo => {    //获取用户信息
      root.user = userInfo
      resolve(root)
    })
  })
  
}

export const ApiUrl = 'http://121.196.176.201:8082'

export const finish = '/game/status/finish' // 提交分数

export const circle = '/game/punishment/circle' // 抽取惩罚