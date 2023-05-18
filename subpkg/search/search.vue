<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar cancelButton="none" :radius="100" @input="input">
      </uni-search-bar>
    </view>
    <!-- 搜索结果列表 -->
    <view class="sugg-list" v-if="searchResult.length!==0">
      <view class="sugg-item" v-for="(item, i) in searchResult" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <!-- 每个item为历史搜索关键词 -->
        <uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodsList(item)">
        </uni-tag>
      </view>
    </view>

  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null,
        // 搜索关键字
        kw: '',
        // 搜索结果列表
        searchResult: [],
        // 搜索关键词的历史记录
        historyList: []

      };
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      input(e) {
        // 防抖操作
        // 500ms内如果连续触发input事件 会将上一个延时器清除掉 再开启下一个延时器
        clearTimeout(this.timer)
        // 设置一个定时器 在500ms之后 才将输入框的值赋值给kw 
        this.timer = setTimeout(() => {
          // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
          this.kw = e.value
          // 根据关键词，获取搜索结果列表
          this.getSearchResult()
        }, 500)
      },
      async getSearchResult() {
        if (this.kw.length === 0) {
          // 没有关键字 将搜索结果列表清空
          this.searchResult = []
          return
        }
        // 如果有关键字 请求获取搜索结果数据
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResult = res.message
        // 1. 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词到历史记录列表
        this.saveSearchHistory()

      },
      gotoDetail(goods_id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
      // 2. 保存搜索关键词的方法
      saveSearchHistory() {
        // this.historyList.push(this.kw)
        //  historyList 数组去重
        // 1. 将 Array 数组转化为 Set 对象 set值唯一
        const set = new Set(this.historyList)
        // 2. 调用 Set 对象的 delete 方法，移除原来的重复元素
        set.delete(this.kw)
        // 3. 调用 Set 对象的 add 方法，向 Set 中添加新的元素
        set.add(this.kw)
        // 4. 将 Set 对象转化为 Array 数组
        this.historyList = Array.from(set)
        //将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))

      },
      // 清空搜索历史记录
      cleanHistory() {
        // 清空搜索历史记录
        this.historyList = []
        // 清空本地存储中的搜索历史记录
        uni.setStorageSync('kw', '[]')
      },
      // 跳转到商品列表页面
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }

    },
    computed: {
      historys() {
        // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
        // 而是应该新建一个内存无关的数组，再进行 reverse 反转
        // 让新添加的搜索关键词历史记录 放在最前面
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    // 吸顶效果
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      // 让文字和右箭头 在一行上显示
      display: flex;
      align-items: center;
      justify-content: space-between;

      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;

    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;

      }
    }

  }
</style>
