const BASE_URL = 'https://api-hmugo-web.itheima.net/api/public/v1'

const BASE_URL_PAY = 'https://uinav.com/api/public/v1'

export default Vue => {
  // 封装第一个$http
  Vue.prototype.$http = async function(config) {
    const { url, data = {}, header = {}, method = 'GET' } = config

    // 显示加载框
    uni.showLoading({
      title: 'Loading....',
    })

    let res = await uni.request({
      // 1. url 接口
      url: BASE_URL + url,
      // 2. 参数
      data,
      // 3. 请求头 - token
      header,
      // 4. 请求类型
      method,
    })

    // 隐藏
    uni.hideLoading()

    return res[1].data.message
  }
  // 封装第二个$http
  Vue.prototype.$http_pay = async function(config) {
    let { url, data = {}, header = {}, method = 'POST' } = config

    let token = uni.getStorageSync('token')
    // 统一添加了token
    if (token) {
      header = {
        Authorization: token,
      }
    }

    let res = await uni.request({
      // 1. url 接口
      url: BASE_URL_PAY + url,
      // 2. 参数
      data,
      // 3. 请求头 - token
      header,
      // 4. 请求类型
      method,
    })

    // console.log('$http_pay', res)

    return res[1].data.message
  }
}

// 第二个 $http => 换三个地方
// 1. BASE_URL_PAY
// 2. $http_pay
// 3. method : 'POST'
