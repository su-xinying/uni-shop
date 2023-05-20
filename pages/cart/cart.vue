<template>
  <view>
    <view class="cart-container" v-if="cartList.length!==0">
      <!-- 收货地址组件 -->
      <my-address></my-address>
      <!-- 标题区域 -->
      <view class="cart-title">
        <!-- 左侧图标 -->
        <uni-icons type="shop" size="18"></uni-icons>
        <!-- 描述文本 -->
        <text class="cart-title-text">购物车</text>
      </view>
      <!-- 商品列表区域 -->
      <uni-swipe-action>
        <block v-for="(item,i) in cartList" :key="i">
          <uni-swipe-action-item :options="options" @click="swipeActionClickHandler(item)">
            <my-goods :goods="item" :showRadio="true" @changeState="changeStateHandler" :showNum="true" @changeNum="changeNumHandler"></my-goods>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>
      <!-- 结算组件 -->
      <my-settle></my-settle>
    </view>
    <!-- 空白购物车区域 -->
    <view class="empty-cart" v-else>
      <image src="/static/cart_empty@2x.png" class="empty-img"></image>
      <text class="tip-text">空空如也~</text>
    </view>

  </view>

</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    // 将 badgeMix 混入到当前页面中进行使用
    mixins: [badgeMix],
    computed: {
      ...mapState('cart', ['cartList'])
    },
    data() {
      return {
        options: [{
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#C00000' // 按钮的背景颜色
          }
        }]
      };
    },
    methods: {
      ...mapMutations('cart', ['updateState', 'updateGoodsCount', 'removeGoodsById']),
      changeStateHandler(e) {
        // 在vuex中更改商品选中状态
        // e事件参数对象
        this.updateState(e)
      },
      changeNumHandler(e) {
        // 在vuex中更改商品数量
        this.updateGoodsCount(e)
      },
      // 点击滑动操作按钮 进行删除
      swipeActionClickHandler(goods) {
        // 在vuex中删除数据
        this.removeGoodsById(goods.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }

  .cart-title {
    height: 40px;
    font-size: 14px;
    padding-left: 5px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      margin-left: 10px;
    }

  }
  .empty-cart{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
    .empty-img{
      width: 90px;
      height: 90px;
    }
    .tip-text{
      font-size: 12px;
      margin-top: 15px;
      color: gray;
    }
  }
</style>
