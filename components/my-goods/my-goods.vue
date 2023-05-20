<template>
    <view class="goods-item">
      <!-- 左侧图片区域 -->
      <view class="goods-item-left">
        <!-- 勾选按钮 -->
        <radio v-if="showRadio" :checked="goods.goods_state" color="#C00000" @click="RadioClickHandler"></radio>
        <image :src="goods.goods_small_logo || defaultPic" mode="" class="goods-pic"></image>
      </view>
      <!-- 右侧信息区域-->
      <view class="goods-item-right">
        <!-- 商品标题 -->
        <view class="goods-name">{{goods.goods_name}}</view>
        <view class="goods-info-box">
          <!-- 商品价格 -->
          <view class="goods-price">￥{{goods.goods_price | tofixed}} </view>
          <!-- 商品数量 -->
          <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
        </view>
      </view>
    </view>
</template>

<script>
	export default {
    props:{
      goods:{
        type:Object,
        default:{}
      },
      // 是否展示勾选按钮
      showRadio:{
        type:Boolean,
        default:false
      },
      // 是否显示价格右侧的 NumberBox 组件
      showNum:{
        type:Boolean,
        default:false
      }
      
    },
    filters:{
      // 把数字处理为带两位小数点的数字
      tofixed(num){
        return Number(num).toFixed(2)
      }
    },
		data() {
			return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
				
			};
		},
    methods:{
      // 勾选按钮点击事件处理函数
      RadioClickHandler(){
        // 点击勾选 修改商品选中状态 并通知父组件在vuex中修改数据
        const goods={
          goods_id:this.goods.goods_id,
          goods_state:!this.goods.goods_state
        }
        this.$emit('changeState',goods)
        
      },
      // NumberBox 组件的 change 事件处理函数
      numChangeHandler(newVal){
        // newVal得到商品数量改变后的新值
        // 数量改变通知父组件修改数据
        this.$emit('changeNum',{
          goods_id:this.goods.goods_id,
          // newVal不一定是数值 加上+ 让goods_count商品数量一定是一个数值
          goods_count:+newVal
        })
        
      }
      
    }
	}
</script>

<style lang="scss">
  .goods-item {
    // 让 goods-item 项占满整个屏幕的宽度
    width: 750rpx;
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
  
    .goods-item-left {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 5px;
  
      .goods-pic {
        width: 100px;
        height: 100px;
        // 防止图片下面有空白间隙
        display: block;
  
      }
    }
  
    .goods-item-right {
      display: flex;
      flex:1;
      flex-direction: column;
      justify-content: space-between;
  
      .goods-name {
        font-size: 13px;
      }
  
      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goods-price {
          font-size: 16px;
          color: #C00000
        }
      }
    }
  }

</style>
