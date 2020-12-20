<template>
  <view>
    <!-- 1. 搜索头部 -->
    <search-header></search-header>

    <!-- 2. 轮播图 -->
    <view class="slider">
      <swiper 
        :indicator-dots="true"
        :autoplay="true" 
        :interval="3000" 
        :circular="true"
        :duration="1000">
        <swiper-item v-for='item in swipers' :key='item.goods_id'>
          <image  :src="item.image_src"></image>
        </swiper-item>
        
      </swiper>
    </view>
    <!-- 3. 菜单导航 -->
    <view class="navs">
      <block v-for='nav in navs' :key='nav.name'>
        <view class="nav">
          <image :src="nav.image_src"></image>
        </view>
      </block>
    </view>
    <!-- 4. 楼层 -->
    <view class="floors">
      <block v-for='(item,index) in floors' :key='index'>
        <view class="floor">
          <!-- 标题 -->
          <view class="floor-title">
            <image :src="item.floor_title.image_src"></image>
          </view>
          <!-- 内容 -->
          <view class="floor-body">
            <view class="left">
              <image :src="item.product_list[0].image_src"></image>
            </view>
            <view class="right">
              <image :style="{ width : item.product_list[1].image_width + 'rpx'  }"  :src="item.product_list[1].image_src"></image>
              <image :style="{ width : item.product_list[2].image_width + 'rpx'  }" :src="item.product_list[2].image_src"></image>
              <image :style="{ width : item.product_list[3].image_width + 'rpx'  }" :src="item.product_list[3].image_src"></image>
              <image :style="{ width : item.product_list[4].image_width + 'rpx'  }" :src="item.product_list[4].image_src"></image>
            </view>
          </view>
        </view>
      </block>
    </view>
    
    <!-- 回到顶部 -->
    <view class="top center" @click="back2top" v-if='isShow'>
      <text class="iconfont icon-shangjiantou"></text>
      <view>顶部</view>
    </view>
  </view>
</template>

<script>
export default {

  data(){
    return {
      swipers : [],
      navs : [],
      floors : [],
      isShow : false
    }
  },
  
  async created(){
    await this.getSwipers()
    await this.getNavs()
    await this.getFloors()
  },
  methods : {
    // 请求轮播图
    async getSwipers(){

      let res = await this.$http({
        url : '/home/swiperdata'
      })
      this.swipers = res
    },
    // 请求菜单导航
    async getNavs(){
      let res = await this.$http({
        url : '/home/catitems'
      })
      console.log('菜单导航',res);
      this.navs = res
    },
    // 请求楼层
    async getFloors(){
      let res = await this.$http({
        url : '/home/floordata'
      })
      console.log('楼层',res);
      this.floors = res
    },
    //  回到顶部
    back2top(){

      uni.pageScrollTo({
        scrollTop : 0,
        duration : 200 
      })
    }

  },

  onPageScroll(e){
    // console.log('页面滚动了',e.scrollTop);
    if (e.scrollTop >= 300) {
      this.isShow = true
    } else {
      this.isShow = false      
    }

  }
}
</script>

<style lang='less' scoped>


// 轮播图
swiper {
  width: 750rpx;
  height: 340rpx;
  image {
    width: 750rpx;
    height: 340rpx;
  }
}

// 菜单导航
.navs {
  display: flex;
  justify-content: space-around;
  padding: 24rpx 0;
  .nav {
    image {
      width: 128rpx;
      height: 128rpx;
    }
  }
}

// 楼层
.floors {
  .floor {
    &-title {
      background: #eee;
      padding-top: 30rpx;
      image {
        width: 750rpx;
        height: 60rpx;
      }
    }
    &-body {
      display: flex;
      padding: 16rpx;
      background: #fff;
      .left {
        margin-right: 10rpx;
        image {
          width: 232rpx;
          height: 386rpx;
          vertical-align: middle;
        }
      }
      .right {
        image {
          width: 233rpx;
          height: 188rpx;
          vertical-align: middle;
        }
        image:nth-child(2n+1) {
          margin-right: 10rpx;
        }
        image:nth-child(-n+2) {
          margin-bottom: 10rpx;
        }
      }
    }
  }
}


.top {
  width: 100rpx;
  height: 100rpx;
  background: yellow;
  border-radius: 50%;
  flex-direction: column;

  position: fixed;
  bottom: 20rpx;
  right: 20rpx;
}

</style>
