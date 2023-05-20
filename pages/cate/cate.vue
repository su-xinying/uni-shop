<template>
  <view>
    <!-- 使用自定义搜索组件 -->
    <my-search @click="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滚动视图区域-->
      <scroll-view scroll-y="true" :style="{height: wh+'px'}" class="left-scroll-view">
        <block v-for="(item,i) in cateList" :key="i">
          <!-- 判断当前项是否为激活索引 如果是就动态添加active类名 -->
          <view :class="['left-scroll-view-item',activeIndex===i?'active':'']" @click="activeChanged(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧滚动视图区域 -->
      <scroll-view scroll-y="true" :style="{height: wh+'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevelTwo" :key="i2">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 当前二级分类下的三级分类列表 -->
          <view class="cate-lv3-list">
            <!-- 三级分类的Item项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 三级分类的文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0,
        // 所有分类数据
        cateList: [],
        // 当前激活项索引值，默认让第一项被选中
        activeIndex: 0,
        // 二级分类数据
        cateLevelTwo: [],
        // 滚动条距离顶部的距离
        scrollTop: 0
      };
    },
    onLoad() {
      // 获取当前系统的信息
      const systemInfo = uni.getSystemInfoSync()
      // 为wh窗口可用高度动态赋值
      // 可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度 - 自定义的search组件高度
      this.wh = systemInfo.windowHeight - 50
      // 获取分类数据
      this.getCateList()
    },
    methods: {
      async getCateList() {
        // 解构出data重命名为res uni.$http 返回一个promise对象
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        // 请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        // 默认显示第一项一级分类下的 二级分类
        this.cateLevelTwo = res.message[0].children
      },
      // 选中项改变的事件处理函数
      activeChanged(i) {
        // 点击改变激活项索引值
        this.activeIndex = i
        // 为二级分类重新赋值 随着选择的一级分类的不同 而变化 
        // i为选择的一级分类索引值
        this.cateLevelTwo = this.cateList[i].children
        // 让 scrollTop 的值在 0 与 1 之间切换 
        // scrollTop前后赋值相同时 不能让滚动条位置重置 所以要在 0 与 1 之间切换 
        this.scrollTop = this.scrollTop === 0 ? 1 : 0

      },
      // 跳转到商品列表页面
      gotoGoodsList(item) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    },
  }
</script>

<style lang="scss">
  .scroll-view-container {
    // 让左右滚动区域横向显示
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        line-height: 60px;
        text-align: center;
        background-color: #f7f7f7;
        font-size: 12px;

        // 激活项样式
        &.active {
          background-color: #ffffff;
          position: relative;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }

      }
    }

    .cate-lv2-title {
      font-size: 12px;
      text-align: center;
      font-weight: bold;
      padding: 15px 0;
    }

    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;

      .cate-lv3-item {
        width: 33.33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;

        image {
          width: 60px;
          height: 60px;
        }

        text {
          font-size: 12px;
        }
      }
    }
  }
</style>
