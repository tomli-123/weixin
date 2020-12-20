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
    <!-- 没有地址 -->
    <view v-else class="no-address" @click="getChooseAddress">
      <button type="primary">点击获取收货地址</button>
    </view>
    <!-- 购物车标题 -->
    <view class="title">购物车</view>
    <!-- 购物车列表 -->
    <view class="carts">
      <block v-for="goods in carts" :key="goods.goods_id">
        <view class="cart">
          <view class="left">
            <checkbox-group @change="changeState(goods.goods_id)">
              <checkbox :checked="goods.isChecked"></checkbox>
            </checkbox-group>
          </view>
          <view class="center">
            <image mode="aspectFill" :src="goods.goods_small_logo"></image>
          </view>
          <view class="right">
            <view class="top line2">{{ goods.goods_name }}</view>
            <view class="btm">
              <view class="price">¥ {{ goods.goods_price }}</view>
              <view class="edit">
                <view @click="add(-1, goods.goods_id)">-</view>
                <view>{{ goods.count }}</view>
                <view @click="add(1, goods.goods_id)">+</view>
              </view>
            </view>
          </view>
        </view>
      </block>
    </view>
    <!-- 底部 -->
    <view class="tool">
      <view class="left">
        <checkbox-group @change="changeAllChecked">
          <checkbox :checked="allChecked">全选</checkbox>
        </checkbox-group>
      </view>
      <view class="center">
        <view
          >合计 : <text>¥ {{ totalPrice }}</text></view
        >
        <view>包含运费</view>
      </view>
      <view class="right mg_center" @click="jump2pay">结算({{ totalCount }})</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addrObj: {}, // 收货地址
      carts: [], // 购物车
    }
  },
  computed: {
    //1. 总个数
    totalCount() {
      let total = 0
      this.carts.forEach(v => {
        if (v.isChecked) {
          total += v.count
        }
      })

      return total

      // return this.carts.reduce((total, v) => {
      //   return total + v.count
      // }, 0)
    },
    //2. 总价格
    totalPrice() {
      let total = 0
      this.carts.forEach(v => {
        if (v.isChecked) {
          total += v.count * v.goods_price
        }
      })
      return total
    },
    //3. 全选
    allChecked() {
      // every
      return this.carts.every(v => v.isChecked)
    },
  },
  onShow() {
    console.log('onShow--------------')

    //1. 获取收货地址
    let addr_local = uni.getStorageSync('addr')
    if (addr_local) {
      this.addrObj = addr_local
    }

    //2. 获取购物车
    this.carts = uni.getStorageSync('carts') || []
  },

  onHide() {
    console.log('onHide---------')

    uni.setStorageSync('carts', this.carts)
  },

  methods: {
    // 点击-获取收货地址
    async getChooseAddress() {
      //1. 获取收货地址
      let addr = await uni.chooseAddress()
      console.log(addr)

      //2. 拼接成一个详情地址字符串
      addr[1].addrStr = `${addr[1].provinceName}${addr[1].cityName}${addr[1].countyName}${addr[1].detailInfo}`

      //3. 把地址对象赋值给 addrObj
      this.addrObj = addr[1]

      //4. 把地址对象保存到本地
      uni.setStorageSync('addr', this.addrObj)
    },
    // 点击 + 和 -
    add(num, id) {
      // console.log(num, id)
      //1. 根据id 找到对应的商品
      let goods = this.carts.find(v => v.goods_id == id)

      //2. 做一个判断 : count = 1 && 点击 -
      if (goods.count == 1 && num == -1) {
        // 确认框
        uni.showModal({
          title: '提示',
          content: '您确定要删除该商品吗?',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定', this)
              // 把该商品从 carts 里面删除
              this.carts = this.carts.filter(v => v.goods_id != id)
            }
          },
        })
      } else {
        // 修改商品的count += num
        goods.count += num
      }
    },
    // 点击商品的选中状态
    changeState(id) {
      console.log('123', id)
      //1. 根据id 找 到购物车里面对应的商品
      let goods = this.carts.find(v => v.goods_id == id)
      //2. 把商品的isChecked 取反
      goods.isChecked = !goods.isChecked
    },
    // 点击全选
    changeAllChecked() {
      // 把全选状态取反, 分别赋值给每个商品的状态
      //1. 拿到全选和购物车
      let tempCarts = this.carts
      let allChecked1 = !this.allChecked

      //2. 遍历
      tempCarts.forEach(v => {
        v.isChecked = allChecked1
      })

      //3. 赋值回去
      this.carts = tempCarts
    },
    // 点击跳转到支付页
    jump2pay() {
      //1. 判断地址问题
      if (!this.addrObj.userName) {
        uni.showToast({
          title: '请选择收货地址',
          icon: 'none',
        })
        return
      }

      //2. 选中的商品问题
      if (this.totalCount === 0) {
        uni.showToast({
          title: '请选择商品',
          icon: 'none',
        })
        return
      }

      //3. 跳转
      uni.navigateTo({
        url: '/pages/pay/pay',
      })
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
  padding-bottom: 100rpx;
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
          view:nth-child(2n + 1) {
            border: 1px solid #666;
            width: 40rpx;
            height: 40rpx;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          view:nth-child(2) {
            margin: 0 20rpx;
          }
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
    // display: flex;
    // justify-content: center;
    // align-items: center;
    color: #fff;
    font-size: 34rpx;
    font-weight: 700;
  }
}

.mg_center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
