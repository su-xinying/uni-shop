export default {
  namespaced: true,
  state: () => ({
    // 收货地址
    address: JSON.parse(uni.getStorageSync('address') || '{}')
  }),
  mutations: {
    // 更新收获地址
    updateAddress(state, address) {
      state.address = address
      // 同步到缓存
      this.commit('user/saveAddress')
    },
    saveAddress(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
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
