<template>
  <view>
    <!-- 头部 -->
    <search-header></search-header>
    <!-- 分类 -->
    <view class="cates">
      <!-- 左侧 -->
      <scroll-view class="left" scroll-y>
        <block v-for="(item, index) in leftCates" :key="item">
          <view :class="{ active: activeIndex == index }" @click="clickTag(index)">{{ item }}</view>
        </block>
      </scroll-view>
      <!-- 右侧 -->
      <scroll-view :scroll-top="scrollTop" class="right" scroll-y>
        <!-- 遍历 电视-空调-洗衣机 -->
        <block v-for="item in rightCates" :key="item.cat_id">
          <!-- 标题 -->
          <view class="title center">
            <text>/</text>
            <text class="text">{{ item.cat_name }}</text>
            <text>/</text>
          </view>
          <!-- 内容 -->
          <view class="content">
            <block v-for="it in item.children" :key="it.cat_id">
              <!-- <navigator url="/pages/list/list?id=it.cat_id&name=it.cat_name" class="item center"> -->
              <navigator
                :url="'/pages/list/list?id=' + it.cat_id + '&name=' + it.cat_name"
                class="item center"
              >
                <image :src="it.cat_icon"></image>
                <text>{{ it.cat_name }}</text>
              </navigator>
            </block>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cates: [], // 分类的全部数据
      activeIndex: 0,
      scrollTop: 0,
    }
  },
  computed: {
    // 左侧数据
    leftCates() {
      return this.cates.map(v => v.cat_name)
    },
    // 右侧数据
    rightCates() {
      // return  this.cates[this.activeIndex].children
      return this.cates.length > 0 && this.cates[this.activeIndex].children
    },
  },
  created() {
    // 先从本地尝试着获取
    let cates_local = uni.getStorageSync('cates')

    if (cates_local) {
      console.log('有值')
      // 判断是否过期
      // 10s 10*1000
      // 7天 7 * 24 * 60 * 60 * 1000
      let isLate = Date.now() - cates_local.time > 20 * 1000
      if (isLate) {
        console.log('过期了')
        this.getCates()
      } else {
        console.log('没有过期')
        this.cates = cates_local.data
      }
    } else {
      console.log('没有值')
      this.getCates()
    }
  },
  methods: {
    // 请求全部数据
    async getCates() {
      let res = await this.$http({
        url: '/categories',
      })
      console.log('分类结果:', res)
      this.cates = res

      // 保存到本地
      uni.setStorageSync('cates', {
        data: this.cates,
        time: Date.now(),
      })
    },
    // 点击左侧
    clickTag(index) {
      this.activeIndex = index

      this.scrollTop = 1

      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
  },
}
</script>

<style lang="less" scoped>
.cates {
  width: 750rpx;
  height: calc(100vh - 100rpx);
  background: pink;
  // vh 和 100%
  // 100% :  父元素高度的100%
  // 100vh : 可视区域的100%
  // css3 的样式计算函数 calc()
  display: flex;
  .left {
    flex: 1;
    background: #ddd;
    view {
      height: 80rpx;
      border-bottom: 2rpx solid #ccc;
      line-height: 80rpx;
      text-align: center;
      border-left: 6rpx solid #ccc;
    }
    view.active {
      border-left: 6rpx solid #ff2d4a;
      background: #eee;
    }
  }
  .right {
    flex: 3;
    background: #fff;
    height: 100%;

    .title {
      height: 80rpx;
      background: #fff;
      color: #666;
      .text {
        margin: 0 30rpx;
      }
    }

    .content {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 33.3%;
        background: #fff;
        flex-direction: column;
        padding: 30rpx 0;
        image {
          width: 100rpx;
          height: 100rpx;
          margin-bottom: 20rpx;
        }
      }
    }
  }
}
</style>
