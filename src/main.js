// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' //导入store，自动寻找index.js
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, //将我们创建的Router实例挂载到这个Vue实例中
  store,  //将我们创建的Vuex实例挂载到这个Vue实例中
  components: {
    App
  },
  template: '<App/>'
})
