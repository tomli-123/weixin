import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

//1. 引入全局样式
import './uni.less'

//3. 引入字体图标
import './static/iconfont.css'

//2. 封装2 : 插件的形式
import plugin from './utils/request'
Vue.use(plugin)

//4. 全局注册组件
import SearchHeader from './components/SearchHeader.vue'
import Tab from './components/Tab.vue'
import Goods from './components/Goods.vue'

Vue.component('ugo-goods', Goods)
Vue.component('ugo-tab', Tab)
Vue.component('search-header', SearchHeader)

// 过滤器
import moment from 'moment'
Vue.filter('date', res => {
  return moment(res).format('YYYY-MM-DD hh:mm')
})

const app = new Vue({
  ...App,
})
app.$mount()
