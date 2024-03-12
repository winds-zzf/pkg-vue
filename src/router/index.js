import Vue from 'vue'
import Router from 'vue-router'
import store from "../store";
import graphRouter from '../components/graph/index'
import studyRouter from '../components/study/index'
Vue.use(Router)

// 因为getNavData使用的是export而不是export default，因此要加上括号
import {getNavData} from "../utils/http";

// 公共静态路由
export const constantRoutes=[
  {
    path:'/',
    name:'Layout',
    component:()=> import('../components/Layout.vue'),
    children:[
      graphRouter,
      studyRouter,
    ]
  },
  {
    path:'/login',
    component:()=>import('../components/Login.vue'),
  },
  {
    path:'/register',
    component:()=>import('../components/Register.vue')
  },
  {
    path:'/404',
    component:()=>import('../components/404.vue')
  },
]

// 动态路由，基于用户权限去加载

const router =  new Router({
  mode:'history', // 去掉地址栏中的#
  routes: constantRoutes,
})

export default router;


