import Vue from "vue";
import Vuex from 'vuex'

// 在vue中使用Vuex
Vue.use(Vuex)

// 挂载VueX对象
const store = new Vuex.Store({
  /*
   * 存放的键值就是所要管理的状态
   */
  state:{},
  /*
   * mutations是操作state数据的方法的集合，例如对数据的修改、添加和删除
   * 为了符合规范，state中的数据只能通过mutations来修改
   */
  mutations:{},
  /*
   * 由于直接在mutations方法中执行异步操作，会引起数据失效，所以提供了Actions，用来专门进行异步操作，最终提交mutations方法
   * 为了符合规范，mutations中的数据只能通过actions来管理
   */
  actions:{},
  /*
   * 多模块
   */
  modules:{},
  /*
   * getters相当于vue中的computed计算属性，getters中有很多的getter，其返回值会根据它的依赖被缓存起来，且只有当他的依赖值发生了改变时才会被重新计算
   */
  getters:{},
});

// 导出store
export default store
