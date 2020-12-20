<template>
  <view>
    <!-- tab栏 -->
    <ugo-tab :tabs="tabs" @myclick="toggleTab"></ugo-tab>
    <!-- 列表部分 -->
    <view class="orders">
      <block v-for="item in list" :key="item.order_id">
        <view class="order">
          <view class="t">
            <view>订单编号</view>
            <view>{{ item.order_number }}</view>
          </view>
          <view class="t">
            <view>订单价格</view>
            <view class="price">¥ {{ item.order_price }}</view>
          </view>
          <view class="t">
            <view>订单日期</view>
            <view>{{ item.create_time | date }}</view>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        { id: 1, name: '全部', isActive: true },
        { id: 2, name: '待付款', isActive: false },
        { id: 3, name: '待发货', isActive: false },
        { id: 4, name: '退款/退货', isActive: false },
      ],
      list: [],
    }
  },
  onLoad() {
    this.changeListById(1)
  },
  methods: {
    // 切换tab
    toggleTab(id) {
      //1. 切换高亮
      this.changeActiveById(id)
      //2. 切换数据
      this.changeListById(id)
    },
    // 切换高亮
    changeActiveById(id) {
      // 排他
      this.tabs.forEach(v => {
        if (v.id === id) {
          v.isActive = true
        } else {
          v.isActive = false
        }
      })
    },
    // 切换数据
    async changeListById(id) {
      let res = await this.$http_pay({
        url: '/my/orders/all',
        method: 'GET',
        data: {
          type: id,
        },
      })
      console.log('数据:', res)
      this.list = res.orders
    },
  },
}
</script>

<style lang="less" scoped>
.orders {
  .order {
    height: 180rpx;
    border-bottom: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20rpx;
    color: #666;
    .t {
      display: flex;
      justify-content: space-between;
      .price {
        color: #ff2d4a;
      }
    }
  }
}
</style>
