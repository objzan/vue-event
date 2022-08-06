import request from '@/utils/request.js'

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

export const loginAPI = () => {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username: 'zhang',
      password: '123456'
    }
  })
}
