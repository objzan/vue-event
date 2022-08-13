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

/**
 * 更新用户资料
 * @param {*} param0 id, username, nickname, email, user_pic
 * @returns Promise对象
 */
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}

/**
 * 更新用户头像
 * @param {*} avatar
 * @returns Promise对象
 */
export const updateAvatarAPI = avatar => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

/**
 * 修改密码
 * @param {*} param0 old_pwd, new_pwd, re_pwd
 * @returns Promise对象
 */
export const updateUserPasswordAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

/**
//  * 获取文章分类数据
 * @returns Promise对象
 */
export const getArticleCateAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 添加文章分类
 * @param {*} param0 cate_name, cate_alias
 * @returns Promise对象
 */
export const addArticleCate = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 更新文章分类
 * @param {*} param0 id, cate_name, cate_alias
 * @returns Promise对象
 */
export const updateArticleCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

/**
 * 删除文章分类
 * @param {*} id
 * @returns Promise对象
 */
export const deleteArticleCateAPI = id => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

/**
 * 发表文章
 * @param {*} fd 表单对象
 * @returns promise对象
 */
export const pubArticleAPI = fd => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    // 参数要的是表单对象, 不能写普通对象, axios内部会判断, 如果是表单对象, 传递的请求体会设置Content-Type: form-data与后端对应
    data: fd
  })
}

/**
 * 获取文章列表
 * @param {*} param0 pagenum, pagesize, cate_id, state
 * @returns promise对象
 */
export const getArticleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    method: 'GET',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

/**
 * 获取文章详情
 * @param {*} id
 * @returns promise对象
 */
export const getArticleDetailAPI = id => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

/**
 * 删除文章
 * @param {*} id
 * @returns promise对象
 */
export const deleteArticleAPI = id => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
