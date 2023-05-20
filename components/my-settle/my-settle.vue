<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label class="radio" @click="changeFullChecked">
      <radio color="#C00000" :checked="isFullChecked"/><text>全选</text>
    </label>
    <!-- 合计区域 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>

    <!-- 结算按钮 -->
    <view class="btn-settle">结算({{checkedCount}})</view>

  </view>
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex'
  export default {
    computed:{
      ...mapGetters('cart',['checkedCount','total','checkedGoodsAmount']),
      isFullChecked(){
        return this.total===this.checkedCount
      }
    },
    data() {
      return {

      };
    },
    methods:{
      ...mapMutations('cart',['updateAllGoodsState']),
      changeFullChecked(){
        this.updateAllGoodsState(!this.isFullChecked)
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
