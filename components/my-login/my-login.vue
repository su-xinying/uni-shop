<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF">
    </uni-icons>
    <!-- 登录按钮 -->
    <!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息 -->
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <!-- <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button> -->
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    data() {
      return {

      };
    },
    computed: {
      ...mapState('user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      getUserInfo(e) {
        // 用户拒绝获取用户信息
        if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
        // 用户允许授权之后 获取用户信息 将用户信息存储到vuex中
        this.updateUserInfo(e.detail.userInfo)
        // 获取用户token
        this.getToken(e.detail)

      },
      // getUserInfo() {
      //   uni.getUserProfile({
      //     desc: 'Wexin', // 这个参数是必须的
      //     success: res => {
      //       // 将用户的基本信息存储到 vuex 中
      //       this.updateUserInfo(res.userInfo)
      //       // 获取登录成功后的 Token 字符串
      //       this.getToken(res)
      //     },
      //     fail: err => {
      //       return uni.$showMsg('您取消了登录授权！')
      //     }
      //   })
      // },
      async getToken(info) {
        const [err, res] = await uni.login().catch(err => err)
        // 判断是否 wx.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
        // 调用成功 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // 调用接口 获取token
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // console.log(loginResult)
        // 正常情况
        // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        // 请求成功 获取token 存储到 vuex中
        // this.updateToken(loginResult.message.token)
        // 登录成功之后 回到之前的页面
        // this.navigateBack()


        // code有问题 获取不到token 模拟token数据进行登录
        if (loginResult.meta.status !== 200) {
          uni.$showMsg('登录失败！code有问题')
        }
        const fade =
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
        this.updateToken(fade)
        this.navigateBack()

      },
      // 返回登录之前的页面
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            // 跳转完成之后 清空vuex中重定向对象信息
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }

      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      background-color: #C00000;
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }

  }
</style>
