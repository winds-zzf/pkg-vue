/*
 * 导入封装过后的axios
 *
 *
 */
import axios from './request'

export function getNavData(){
  return axios({
    method:'get',
    url:'get_navData'   //会自动添加baseURL
  });
}
