export default {
  namespaced: true,
  state: () => ({
    // 收货地址
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    token: uni.getStorageSync('token') || '',
    userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
    // 重定向对象  { openType, from }
    redirectInfo: null
  }),
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      // 同步到缓存
      this.commit('user/saveAddress')
    },
    saveAddress(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 更改用户信息操作
    updateUserInfo(state, userinfo) {
      state.userInfo = userinfo
      // 同步到缓存
      this.commit('user/saveUserInfo')
    },
    saveUserInfo(state) {
      uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
    },
    // 更新token
    updateToken(state, token) {
      state.token = token
      this.commit('user/saveToken')
    },
    saveToken(state) {
      uni.setStorageSync('token', state.token)
    },
    // 更改重定向信息
    updateRedirectInfo(state,info){
      state.redirectInfo=info
    }

  },
  getters: {
    addstr(state) {
      // 如果address不存在 返回空字符串
      if (!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}
