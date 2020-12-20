<template>
  <view class="search">
    <!-- 搜索头部 -->
    <view class="search-header">
      <div class="left">
        <input
          v-model="keyword"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @confirm="handleConfirm"
          type="text"
          placeholder="请输入关键字"
        />
      </div>
      <div class="right" @touchstart.stop="cancel" v-if="isFocused">取消</div>
    </view>
    <!-- 列表 -->
    <scroll-view v-if="recommend_list.length > 0" scroll-y class="list">
      <block v-for="item in recommend_list" :key="item.goods_name">
        <navigator :url="'/pages/detail/detail?id=' + item.goods_id" class="item line1">{{
          item.goods_name
        }}</navigator>
      </block>
    </scroll-view>
    <!-- 历史 -->
    <view class="history" v-else>
      <view class="history-title">历史记录</view>
      <view class="history-content">
        <block v-for="h in history" :key="h">
          <view @click="clickHistory(h)" class="h">{{ h }}</view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      keyword: '',
      isFocused: false, // 是否聚焦
      recommend_list: [], // 监听搜索出来的推荐数据
      history: [],
    }
  },
  watch: {
    keyword(v) {
      if (v.trim() === '') {
        this.recommend_list = []
      }
    },
  },
  onLoad() {
    this.history = uni.getStorageSync('history') || []

    // 一进来 走 onLoad ,在 onLoad 里面把 普通函数 => 防抖的函数
    this.handleInput = _.debounce(this.handleInput, 500)
  },
  methods: {
    // 聚焦
    handleFocus() {
      // console.log('聚焦')
      this.isFocused = true
    },
    // 失焦
    handleBlur() {
      // console.log('失焦')
      this.isFocused = false
    },
    // 监听 - 搜索
    async handleInput() {
      console.log(this.keyword)

      let res = await this.$http({
        url: '/goods/qsearch',
        data: {
          query: this.keyword,
        },
      })
      console.log('搜索结果:', res)
      this.recommend_list = res
    },
    // 点击取消
    cancel() {
      // console.log('click')
      this.keyword = ''
      this.recommend_list = []
    },
    // 点击完成 / 回车
    handleConfirm() {
      //1. keyword 添加到 history
      this.history.unshift(this.keyword)

      // [1,2,1] => { 1,2 } => [1,2]
      this.history = [...new Set(this.history)]

      //2. 保村到本地
      uni.setStorageSync('history', this.history)

      console.log('点击完成')
      uni.navigateTo({
        url: `/pages/list/list?keyword=${this.keyword}`,
      })
    },
    // 点击 历史
    clickHistory(h) {
      this.keyword = h
      this.handleInput()
    },
  },
}
</script>

<style lang="less" scoped>
.search {
  background: #ddd;
  padding: 20rpx 16rpx;
  height: calc(100vh - 40rpx);
  .search-header {
    height: 80rpx;
    width: 718rpx;
    // background: pink;
    display: flex;
    .left {
      // width: 300px;
      flex: 1;
      background: #fff;
      input {
        // background: #ddd;
        height: 100%;
        padding-left: 20rpx;
      }
    }
    .right {
      width: 120rpx;
      background: #fff;
      margin-left: 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5rpx;
    }
  }
}

.list {
  margin-top: 20rpx;
  height: calc(100vh - 80rpx - 40rpx - 20rpx);
  .item {
    background: #fff;
    height: 80rpx;
    line-height: 80rpx;
    padding-left: 10rpx;
    border-bottom: 1px solid #ccc;
  }
}

.history {
  // background: pink;
  margin-top: 20rpx;
  padding: 0 10rpx;
  &-title {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 38rpx;
    font-weight: 700;
  }
  &-content {
    display: flex;
    flex-wrap: wrap;
    .h {
      height: 60rpx;
      padding: 0 20rpx;
      background: #fff;
      margin-right: 20rpx;
      line-height: 60rpx;
      text-align: center;
      margin-bottom: 10rpx;
    }
  }
}
</style>
