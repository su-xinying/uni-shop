export default {
  namespaced: true,
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count,goods_small_logo, goods_state }
    cartList: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  mutations: {
    addToCartList(state, goods) {
      // 如果不存在 返回undefined 如果存在 返回符合条件的该值即该item
      const result = state.cartList.find(item => item.goods_id === goods.goods_id)

      if (!result) {
        // 如果购物车中没有这件商品 直接将该商品信息添加进去
        state.cartList.push(goods)
      } else {
        // 如果购物车中有这件商品，则只更新数量即可
        result.goods_count++
      }
      // 同步缓存
      this.commit('cart/saveCartList')
    },
    // 购物车信息数据持久化
    saveCartList(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cartList))
    },
    // 更改商品选中状态
    updateState(state, goods) {
      const findResult = state.cartList.find(item => item.goods_id === goods.goods_id)
      // 有对应的商品信息对象
      if (findResult) {
        // 更改对应商品信息对象中的勾选状态
        findResult.goods_state = goods.goods_state
        // 同步缓存
        this.commit('cart/saveCartList')
      }
    },
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cartList.find(item => item.goods_id === goods.goods_id)
      if (findResult) {
        // 更新对应商品的数量
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('cart/saveCartList')
      }
    },
    // 删除商品信息对象
    removeGoodsById(state, goods_id) {
      state.cartList=state.cartList.filter(item=>item.goods_id!==goods_id)
      // 将结果同步到缓存
      this.commit('cart/saveCartList')
    },
    // 更改所有商品的勾选状态
    updateAllGoodsState(state,newState){
      state.cartList.forEach(item=>item.goods_state=newState)
      // 同步到缓存
      this.commit('cart/saveCartList')
    }
  },
  getters: {
    // 统计购物车中商品的总数
    total(state) {
      // let sum = 0
      // state.cartList.forEach(item => sum += item.goods_count)
      // return sum
      return state.cartList.reduce((total,item)=> total+=item.goods_count,0)
    },
    // 统计勾选商品总数
    checkedCount(state) {
      // 过滤出已勾选的所有商品 组成一个数组
      // 通过数组 reduce方法 遍历每一项进行累加
      return state.cartList.filter(item =>item.goods_state).reduce((total,item2)=>total+=item2.goods_count,0)
    },
    //统计所有已勾选商品的总价格
    checkedGoodsAmount(state){
      return state.cartList.filter(item=>item.goods_state)
      .reduce((total,item2)=>total+=item2.goods_count*item2.goods_price,0)
      .toFixed(2)
    }
    
  }
}
