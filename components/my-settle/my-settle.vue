<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label class="radio" @click="changeFullChecked">
      <radio color="#C00000" :checked="isFullChecked" /><text>全选</text>
    </label>
    <!-- 合计区域 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>

    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>

  </view>
</template>

<script>
  import {
    mapState,
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    computed: {
      ...mapGetters('cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('user', ['addstr']),
      ...mapState('user', ['token']),
      ...mapState('cart', ['cartList']),
      isFullChecked() {
        return this.total === this.checkedCount
      }
    },
    data() {
      return {
        // 倒计时秒数
        seconds: 3,
        // 定时器
        timer: null

      };
    },
    methods: {
      ...mapMutations('cart', ['updateAllGoodsState']),
      ...mapMutations('user', ['updateRedirectInfo']),
      changeFullChecked() {
        this.updateAllGoodsState(!this.isFullChecked)
      },
      // 点击结算按钮 进行条件判断
      settlement() {
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
        if (!this.addstr) return uni.$showMsg('请选择收货地址！')
        // 如果token不存在 倒计时自动跳转到登录页面
        if (!this.token) return this.delayNavigate()
        // 进行微信支付
        this.payOrder()
      },
      // 延时跳转操作
      delayNavigate() {
        // 每次倒计时时 将秒数重置为3
        this.seconds = 3
        // 展示提示信息 此时秒数为3
        this.showTips(this.seconds)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            // 清除定时器
            clearInterval(this.timer)
            // 跳转到登录页面
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                // 跳转到登录页面成功之后
                // 将返回页 的 信息 存储到vuex中
                this.updateRedirectInfo({
                  // 跳转的方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/cart/cart'
                })
              }
            })
            // 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
            return
          }
          this.showTips(this.seconds)
        }, 1000)

      },
      // 展示倒计时信息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 提示框持续时间 1.5 秒后自动消失
          duration: 1500
        })
      },
      async payOrder() {
        // 1.创建订单
        // 1.1设置请求参数
        const data = {
          order_price: this.checkedGoodsAmount,
          consignee_addr: this.addstr,
          goods: this.cartList.filter(item => item.goods_state).map(item => ({
            goods_id: item.goods_id,
            goods_number: item.goods_count,
            goods_price: item.goods_price
          }))
        }
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', data)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number

        // 2.订单预支付
        // 2.1 发起请求获取订单预支付的参数对象 ，里面包含了订单支付相关的必要参数
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        // 2.2 预付订单生成失败
        if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay

        // 3.发起微信支付
        // 3.1 调用 uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 发生错误发起微信支付失败 未完成支付
        if (err) return uni.$showMsg('订单未支付！')
        // 3.3 发起微信支付成功，进一步查询支付的结果
        const {
          data: res3
        } = await
        uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: orderNumber
        })
        
        // 3.4 检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        // 3.5 检测到订单支付完成
        uni.showToast({
          title: '支付完成！',
          icon: 'success'
        })
      }

    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    background-color: white;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount {
      color: #c00000;
      font-weight: bold;
    }

    .btn-settle {
      background-color: #C00000;
      height: 50px;
      line-height: 50px;
      color: white;
      text-align: center;
      padding: 0 10px;
      min-width: 100px;

    }
  }
</style>
