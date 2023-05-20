<template>
  <view class="goods-detail-container" v-if="goodsDetail.goods_name">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in goodsDetail.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goodsDetail.goods_price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{goodsDetail.goods_name}}</view>
        <!-- 收藏 -->
        <view class="sc">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>

      </view>
      <!-- 快递 -->
      <view class="yf">快递：免运费</view>
    </view>
    <!-- 商品详情信息 -->
    <!-- uniapp富文本 nodes属性渲染html字符串 -->
    <rich-text :nodes="goodsDetail.goods_introduce"></rich-text>
    <!-- 商品导航组件 -->
    <!-- fill 控制右侧按钮的样式 -->
    <!-- options 左侧按钮的配置项 -->
    <!-- buttonGroup 右侧按钮的配置项 -->
    <!-- click 左侧按钮的点击事件处理函数 -->
    <!-- buttonClick 右侧按钮的点击事件处理函数 -->
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      ...mapGetters('cart', ['total'])
    },
    watch: {
      total: {
        handler(newVal) {
          const findResult = this.options.find(item => item.text === '购物车')
          if (findResult) {
            // 动态为购物车按钮的 info 属性赋值
            findResult.info = newVal
          }
        },
        immediate: true
      }
    },
    data() {
      return {
        // 商品详情数据
        goodsDetail: {},
        goodsId: '',
        options: [{
          icon: 'shop',
          text: '店铺',
          infoBackgroundColor: '#007aff',
          infoColor: "red"
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]

      };
    },
    onLoad(options) {
      // 获取页面跳转时所携带的商品id参数
      const goods_id = options.goods_id
      // 获取商品详情数据
      this.getGoodsDetail(goods_id)
    },
    methods: {
      ...mapMutations('cart', ['addToCartList']),
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        // 处理商品详情信息中图片下方出现空白间隙 添加display:block样式即可解决
        // 解决 .webp 格式图片在 ios 设备上无法正常显示的问题
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;"').replace(
          /webp/g, 'jpg')
        this.goodsDetail = res.message

      },
      // 图片预览效果
      preview(index) {
        uni.previewImage({
          // 当前显示图片的索引
          current: index,
          // 返回一个新数组 新数组里包含所有大图片的url地址
          urls: this.goodsDetail.pics.map(item => item.pics_big)
        })

      },
      onClick(e) {
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      buttonClick(e) {
        if (e.content.text === '加入购物车') {
          // 组织一个商品的信息对象
          const goods = {
            goods_id: this.goodsDetail.goods_id, // 商品的Id
            goods_name: this.goodsDetail.goods_name, // 商品的名称
            goods_price: this.goodsDetail.goods_price, // 商品的价格
            goods_count: 1, // 商品的数量
            goods_small_logo: this.goodsDetail.goods_small_logo, // 商品的图片
            goods_state: true // 商品的勾选状态
          }
          // 把商品信息对象存储在vuex中的购物车数组中
          this.addToCartList(goods)

        }

      }
    },
  }
</script>

<style lang="scss">
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      color: #C00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        padding-right: 10px;
      }

      .sc {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }

    .yf {
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    }

  }

  .goods-detail-container {
    // 防止页面内容被底部的商品导航组件遮盖
    padding-bottom: 50px;
  }

  .goods_nav {
    // 给商品导航组件固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
