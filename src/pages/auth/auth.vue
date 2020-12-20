<template>
  <view>
    <button type="primary" plain open-type="getUserInfo" @getuserinfo="getUserInfo">
      获取授权
    </button>
  </view>
</template>

<script>
export default {
  methods: {
    async getUserInfo(e) {
      //1. 获取前四个参数
      const { encryptedData, rawData, iv, signature } = e.detail

      //2. 获取最后一个参数
      let r = await uni.login()
      const { code } = r[1]

      //3. 发送请求了
      let res = await this.$http_pay({
        url: '/users/wxlogin',
        data: {
          encryptedData,
          rawData,
          iv,
          signature,
          code,
        },
      })

      /**
       * 坑1 : 接口换, BASE_URL => BASE_URL_PAY
       * 坑2 : post
       * 坑3 : appid => 个人 ==> 企业
       * 坑4 : 大家做不了这个功能
       */

      console.log('授权获取token', res)

      //4. 保存token
      uni.setStorageSync('token', res.token)

      //5. 返回
      uni.navigateBack()
    },
  },
}
</script>

<style lang="less" scoped>
button {
  margin-top: 60rpx;
  width: 60%;
}
</style>
