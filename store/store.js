import Vue from 'vue'
import Vuex from 'vuex'
import cart from "./cart.js"
import user from './user.js'

Vue.use(Vuex)

const store = new Vuex.Store({

  modules: {
    cart,
    user
  },
})
// 向外共享 Store 的实例对象
export default store
