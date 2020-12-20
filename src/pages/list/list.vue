<template>
  <view>
    <ugo-tab @myclick="toggleTab" :tabs="tabs"></ugo-tab>
    <!-- 列表部分 -->
    <block v-if="tabs[0].isActive">
      <view>
        <block v-for="goods in list" :key="goods.goods_id">
          <ugo-goods :goods="goods"></ugo-goods>
        </block>
      </view>
    </block>
    <block v-else-if="tabs[1].isActive">
      <view>销量部分</view>
    </block>
    <block v-else>
      <view>价格部分</view>
    </block>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: 0,
      tabs: [
        { id: 1, name: '综合', isActive: true },
        { id: 2, name: '销量', isActive: false },
        { id: 3, name: '价格', isActive: false },
      ],
      list: [],
      keyword: '',
      pagenum: 1,
      pagesize: 5,
      hasMore: true, // 默认认为还是有值的
    }
  },
  onLoad(query) {
    console.log('list:', query)
    const { id, name, keyword } = query
    //1. 处理id
    this.id = id
    this.keyword = keyword

    //2. 处理name
    uni.setNavigationBarTitle({
      title: name,
    })

    //3. 调用
    this.getList()
  },

  methods: {
    // 切换tab
    toggleTab(id) {
      console.log('ugo-tab传递过来的id:', id)
      // 遍历, 判断id等于传递过来的id =>isActive : true , 其他都为 false
      this.tabs.forEach(v => {
        if (v.id == id) {
          v.isActive = true
        } else {
          v.isActive = false
        }
      })
    },
    // 请求列表数据
    async getList() {
      let res = await this.$http({
        url: '/goods/search',
        data: {
          query: this.keyword,
          cid: this.id || '',
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      })
      console.log('list:', res)

      // 手动停止下拉刷新的动画
      uni.stopPullDownRefresh()

      this.list = [...this.list, ...res.goods]
      //      3                   5
      if (res.goods.length < this.pagesize) {
        this.hasMore = false
      }
    },
  },

  onReachBottom() {
    console.log('上拉加载')

    // 0
    if (!this.hasMore) {
      uni.showToast({
        title: '无法加载更多.....',
        icon: 'none',
      })

      return
    }

    //1. 页码 ++
    this.pagenum++

    //2. 再次请求
    this.getList()
  },

  // 下拉刷新
  onPullDownRefresh() {
    console.log('123')
    // 重新 请求
    //1. 重置
    this.list = []
    this.pagenum = 1
    this.hasMore = true

    //2. 请求
    this.getList()
  },
}
</script>

<style></style>
