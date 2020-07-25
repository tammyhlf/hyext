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