/*
 * 封装axios请求
 *
 *
 */
import axios from "axios";

// 请求复用
axios.defaults.baseURL = 'http://localhost:8888/'

/* 请求、响应拦截器 */
// 请求拦截器（发送请求前的处理）
axios.interceptors.request.use(config=>{
  return config;
})
// 响应拦截器（响应接受后的处理）
axios.interceptors.response.use(response=>{
  return response;
},err=>{
  return Promise.reject(err)
})

// 导出axios
export default axios
