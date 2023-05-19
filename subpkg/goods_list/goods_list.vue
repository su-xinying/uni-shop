<template>
  <view>
    <view class="goods-list">
      <view v-for="(item,i) in goodsList" :key="i" @click="gotoDetail(item)">
        <my-goods :goods="item"></my-goods>
      </view>
      
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 定义请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类id
          cid: '',
          // 请求页码值
          pagenum: 1,
          // 每页数据条数
          pagesize: 10,
        },
        // 商品列表数据
        goodsList: [],
        // 数据总数
        total: 0,
        // 定义节流阀
        isLoading:false
      };
    },
    onLoad(options) {
      // 页面跳转时携带的参数 保存在请求参数对象中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''

      // 获取商品列表数据
      this.getGoodsList()
    },
    methods: {
      async getGoodsList(cb) {
        this.isLoading=true
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        this.isLoading=false
        // 数据请求完毕 就关闭下拉刷新
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功 为数据赋值
        // 新旧数据合并
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
      },
      // 跳转到商品详情界面
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id
        })
      }

    },
    // 上拉触底事件 上拉加载更多
    onReachBottom() {
      if(this.queryObj.pagenum*this.queryObj.pagesize>=this.total) return uni.$showMsg('数据加载完毕！')
      // 判断是否已经在发送请求 节流操作 如果是，则不发起额外的请求
      if(this.isLoading) return
      this.queryObj.pagenum++
      // 重新获取数据
      this.getGoodsList()
    },
    // 下拉刷新事件
    onPullDownRefresh() {
      // 重置数据
      this.queryObj.pagenum=1
      this.total=0
      this.goodsList=[]
      this.isLoading=false
      // 重新发起请求 获取数据
      // 将关闭下拉刷新操作传进去
      this.getGoodsList(()=>uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">
 
</style>
