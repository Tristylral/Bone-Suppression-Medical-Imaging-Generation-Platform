/*
 * @Author: yrh
 * @Date: 2024-04-24 14:07:06
 * @LastEditors: yrh
 * @LastEditTime: 2024-06-14 16:17:41
 * @Description: 用户接口登录
 */

import axios from 'axios';
const baseURL = import.meta.env.APP_APIHOST;

const instance = axios.create({ baseURL });

instance.interceptors.request.use(function (config) {
  const token = getToken();
  if (token) {
    config.headers['token'] = token;
  }
  return config;
});

const tokenKey = 'token';

export const getToken = () => localStorage.getItem(tokenKey);

// 详情
export const getUserInfo = () => instance.get('/api/users/me');

// 登录
export const login = (data: any) => instance.post('/api/auth/local', data);

// 注册
export const register = (data: any) => instance.post('/api/auth/local/register', data);

// 登出
export const logout = () => localStorage.setItem(tokenKey, '');

// 自动登录1
export const autoLogin = (data: any) => instance.post('/api/custom/autoAuthUser', data);

// 设置token
export const setToken = (token: string) => localStorage.setItem(tokenKey, token);

// 设置Id
export const setId = (id: any) => localStorage.setItem('id', id);

// 获取Id
export const getId = () => localStorage.getItem('id');

// 设置cxr
export const setCxr = (id: any) => localStorage.setItem('cxr', id);

// 获取cxr
export const getCxr = () => localStorage.getItem('cxr');

// 设置bs
export const setBs = (id: any) => localStorage.setItem('bs', id);

// 获取bs
export const getBs = () => localStorage.getItem('bs');

// 获取个人素材列表
export const getFileList = (data: any) => instance.get('/api/user-materials?populate=*', data);

// 上传素材
export const uploadImg = (data: any) => instance.post('/api/upload', data);

// 创建素材1
export const createdMaterial = (data: any) => instance.post('/api/user-materials', data);

// 删除素材
export const removeMaterial = (id: any) => instance.delete('/api/user-materials/' + id);

// 创建文件(先不管)
export const createdTempl = (data: any) => instance.post('/api/user-templs', data);

// 删除文件(先不管)
export const removeTempl = (data: any) => instance.delete(`/api/user-templs/${data}`);

// 更新素材(先不管)
export const updataTempl = (id: any, data: any) => instance.put(`/api/user-templs/${id}`, data);

// 查询素材列表
export const getTmplList = (data: any) => instance.get(`/api/user-templs?${data}`);

// 查询素材列表
export const getTmplInfo = (data: any) => instance.get(`/api/user-templs/${data}`);
