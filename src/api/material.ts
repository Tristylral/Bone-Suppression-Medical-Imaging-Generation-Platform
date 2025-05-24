/*
 * @Author: yrh
 * @Date: 2024-04-24 14:07:06
 * @LastEditors: yrh
 * @LastEditTime: 2024-06-12 21:42:00
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
function getToken() {
  const token = localStorage.getItem(tokenKey);
  return token;
}

// web详情(没用)
export const getWebInfo = () => instance.get('/api/web-site?populate=*');

//上传第一手影像
export const postImage = (data: any) => instance.post('api/postFirstImage' + data);

//获取骨残差图像
export const getBoneImage = (data: any) => instance.get('/api/getBoneImage' + data);

//上传骨抑制率
export const postBoneInhibition = (data: any) => instance.post('api/getFinishedImage' + data);

//更新骨抑制率图像
export const getNewBoneInhibition = (data: any) => instance.get('api/updateBoneImage' + data);
