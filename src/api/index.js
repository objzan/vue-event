import request from '@/utils/request.js'

/**
 * 注册接口
 * @param {*} param0 { username：用户名, password：密码, repassword：再次确定密码 }
 * @returns Promise对象
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 * 登录接口
 * @param {*} param0 { username：用户名, password：密码 }
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取用户资料
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo'
  })
}

/**
 * 获取侧边栏数据
 * @returns Promise对象
 */
export const getMenuListAPI = () => {
  return request({
    url: '/my/menus'
  })
}
