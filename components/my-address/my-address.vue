<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address)==='{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>
    <!-- 渲染收货信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：{{address.userName}}</view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：{{address.telNumber}}</view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addstr}}</view>
      </view>
    </view>
    <!-- 底部的边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      ...mapState('user', ['address']),
      ...mapGetters('user', ['addstr'])
    },
    data() {
      return {

      };
    },
    methods: {
      ...mapMutations('user', ['updateAddress']),
      async chooseAddress() {
        // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能 uni.chooseAddress()返回一个promise对象
        // 返回值是一个数组：第 1 项为错误对象；第 2 项为选择收货地址成功之后的收货地址对象
        const [err, success] = await uni.chooseAddress().catch(err => err)
        // 选择地址成功后 将地址信息对象存入 vuex中
        if (err === null && success.errMsg === 'chooseAddress:ok') {
          this.updateAddress(success)
        }

        // 用户没有地址授权
        if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg ===
            'chooseAddress:fail authorize no response')) {
          this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
        }
      },
      // 调用此方法，重新发起收货地址的授权
      async reAuth() {
        // 提示用户对地址进行授权 uni.showModal返回一个promise对象
        // confirmResult可以获取选择结果
        const [err2, confirmResult] = await uni.showModal({
          content: '检测到您没打开地址权限，是否去设置打开？',
          confirmText: "确认",
          cancelText: "取消",
        })
        // 如果弹框异常，则直接退出
        if (err2) return
        // 用户点击了 “取消” 按钮
        if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权！')
        // 用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权设置页面 让用户重新进行授权
        if (confirmResult.confirm) return uni.openSetting({
          // 设置成功之后 可以通过settingResult获取设置结果
          success: (settingResult) => {
            // 设置结果等于 true =>授权成功
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
            // 设置结果等于 false =>未授权
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .address-border {
    // 底部边框线
    display: block;
    width: 100%;
    height: 5px;
  }

  // 收货地址盒子
  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // 收货信息盒子
  .address-info-box {
    font-size: 12px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;

    .row1 {
      display: flex;
      justify-content: space-between;

      .row1-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .row2 {
      display: flex;
      align-items: center;
      margin-top: 10px;

      .row2-left {
        white-space: nowrap;
      }
    }
  }
</style>
