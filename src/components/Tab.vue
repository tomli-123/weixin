<template>
  <view class="tabs">
    <block v-for="tab in tabs" :key='tab.id'>
     <div @click="clickTab(tab.id)" class="tab center" :class="{ active : tab.isActive }">{{ tab.name }}</div>
    </block>
  </view>
</template>

<script>

export default {
  props : ['tabs'],
  methods : {
    clickTab(id){
     console.log(id); 

    //  子传父第一步 : 子触发自定义事件并且传参
    this.$emit('myclick',id)
    }
  }
}

</script>

<style lang='less' scoped>

.tabs {
  height: 120rpx;
  background: #eee;
  display: flex;

  .tab {
    flex: 1;
    border-bottom: 8rpx solid #eee;
  }
  .tab.active {
    border-bottom: 8rpx solid #ff2d4a;
    color: #ff2d4a
  }

}


</style>