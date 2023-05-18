<template>
	<view>
    <view class="my-search-container" :style="{'background-color':bgColor}">
      <view class="my-search-box" :style="{'border-radius':radius+'px'}" @click="searchBoxHandler">
        <!-- 搜索图标 -->
        <uni-icons type="search" size="17"></uni-icons>
        <!-- 文本 -->
        <text class="placeholder">搜索</text>
        
      </view>
      
    </view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
    props:{
      // 背景颜色
      bgColor:{
        type:String,
        default:'#C00000'
      },
      // 圆角尺寸
      radius:{
        type:Number,
        default:15
      }
    },
    methods:{
      searchBoxHandler(){
        // 触发外界通过 @click 绑定的 click 事件处理函数
        this.$emit('click')
      }
    }
	}
</script>

<style lang="scss">
  .my-search-container{
    // 背景颜色改由props属性进行控制
    // background-color: #C00000;
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    .my-search-box{
      background-color: #FFFFFF;
      height: 36px;
      // 圆角尺寸改由props属性进行控制
      // border-radius: 15px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .placeholder{
        font-size: 15px;
        margin-left: 5px;
      }
      
    }
    
  }
  

</style>
