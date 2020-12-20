<template>
  <view>
    <!-- 有地址 -->
    <view class="address" v-if="addrObj.userName">
      <view class="top">
        <view>{{ addrObj.userName }}</view>
        <view>{{ addrObj.telNumber }}</view>
      </view>
      <view class="bottom">{{ addrObj.addrStr }}</view>
    </view>
    <!-- 购物车标题 -->
    <view class="title">购物车</view>
    <!-- 购物车列表 -->
    <view class="carts">
      <block v-for="goods in carts" :key="goods.goods_id">
        <view class="cart">
          <view class="center">
            <image mode="aspectFill" :src="goods.goods_small_logo"></image>
          </view>
          <view class="right">
            <view class="top line2">{{ goods.goods_name }}</view>
            <view class="btm">
              <view class="price">¥ {{ goods.goods_price }}</view>
              <view class="edit">
                <!-- <view @click="add(goods.goods_id, -1)">-</view> -->
                <view>X {{ goods.count }}</view>
                <!-- <view @click="add(goods.goods_id, 1)">+</view> -->
              </view>
            </view>
          </view>
        </view>
      </block>
    </view>
    <!-- 底部 -->
    <view class="tool">
      <view class="left"> </view>
      <view class="center">
        <view
          >合计 : <text>¥ {{ totalPrice }}</text></view
        >
        <view>包含运费</view>
      </view>
      <view class="right mg_center" @click="pay">支付({{ totalCount }})</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addrObj: {},
      carts: [],
    }
  },
  computed: {
    totalCount() {
      let total = 0
      this.carts.forEach(v => {
        total += v.count
      })
      return total
    },
    totalPrice() {
      let total = 0
      this.carts.forEach(v => {
        total += v.count * v.goods_price
      })
      return total
    },
  },

  onLoad() {
    //1. 从本地获取地址
    this.addrObj = uni.getStorageSync('addr')

    //2. 从本地获取购物车
    let carts = uni.getStorageSync('carts')
    this.carts = carts.filter(v => v.isChecked)
  },
  methods: {
    // 点击支付
    async pay() {
      //1. 尝试从本地获取token
      let token = uni.getStorageSync('token')
      if (!token) {
        // 跳转到授权页获取token
        uni.navigateTo({
          url: '/pages/auth/auth',
        })
        return
      }

      //2. 开始支付......
      //2.1 创建订单
      // this.carts=[]  ==>goods=[]
      let goods = this.carts.map(v => {
        return {
          goods_id: v.goods_id,
          goods_number: v.count,
          goods_price: v.goods_price,
        }
      })

      let res1 = await this.$http_pay({
        url: '/my/orders/create',

        data: {
          order_price: this.totalPrice,
          consignee_addr: this.addrObj.addrStr,
          goods,
        },
      })
      const { order_number } = res1
      // console.log('创建订单:', order_number)
      //2.2 预支付
      let res2 = await this.$http_pay({
        url: '/my/orders/req_unifiedorder',
        data: {
          order_number,
        },
      })
      const { pay } = res2
      //2.3 支付
      await uni.requestPayment(pay)

      //2.4 查看支付状态
      let res4 = await this.$http_pay({
        url: '/my/orders/chkOrder',
        data: {
          order_number,
        },
      })
      // 成功 : 支付成功  失败:null
      console.log('支付状态:', res4)

      //2.5 支付收尾
      if (res4) {
        // 2.5.1 提示
        uni.showToast({
          title: res4,
        })
        // 2.5.2 把当前支付的商品从购物车里面清除
        let carts = uni.getStorageSync('carts')
        carts = carts.filter(v => !v.isChecked)
        uni.setStorageSync('carts', carts)
        // 2.5.3 跳转到订单页
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/order/order',
          })
        }, 2000)
      } else {
        uni.showToast({
          title: '支付失败',
          icon: 'none',
        })
      }
    },
  },
}
</script>

<style scoped lang="less">
.no-address {
  height: 120rpx;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.address {
  height: 120rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10rpx;
  .top {
    display: flex;
    justify-content: space-between;
  }
}

.title {
  height: 100rpx;
  line-height: 100rpx;
  color: #ff2d4a;
  border-top: 1px solid #ff2d4a;
  border-bottom: 1px solid #ff2d4a;
  padding-left: 30rpx;
  font-size: 32rpx;
}

.carts {
  .cart {
    display: flex;
    height: 200rpx;
    background: #fff;
    border-bottom: 1px solid #ccc;
    padding-left: 20rpx;
    .left {
      flex: 1;
      // background: pink;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .center {
      flex: 3;
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        width: 140rpx;
        height: 140rpx;
      }
    }
    .right {
      flex: 6;
      // background: skyblue;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20rpx;
      .btm {
        display: flex;
        justify-content: space-between;
        .price {
          color: #ff2d4a;
        }
        .edit {
          display: flex;
        }
      }
    }
  }
}

.tool {
  height: 100rpx;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  display: flex;
  .left {
    flex: 2;
    // background: skyblue;
    display: flex;
    padding-left: 30rpx;
    align-items: center;
  }
  .center {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8rpx;
    align-items: flex-end;
    text {
      color: #ff2d4a;
    }
  }
  .right {
    flex: 1.5;
    background: #ff2d4a;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 34rpx;
    font-weight: 700;
  }
}
</style>
