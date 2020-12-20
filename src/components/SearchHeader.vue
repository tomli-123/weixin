<template>
  <navigator url="/pages/search/search" class="search">
    <view class="search-bar center">
      <text class="iconfont icon-search"></text>
      <text>搜索</text>
    </view>
  </navigator>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
// 搜索头部
.search {
  background: #ff2d4a;
  padding: 20rpx 16rpx;
  &-bar {
    height: 60rpx;
    width: 718rpx;
    background: #fff;
    border-radius: 5rpx;
    color: #999;
    text {
      margin-left: 20rpx;
    }
  }
}
</style>
