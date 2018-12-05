import Vue from 'vue'
import App from './App'
import '../static/css/weui.css'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/index/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#1296db',
      navigationBarTitleText: '螃蟹停车',
      navigationBarTextStyle: 'light',
      backgroundColor: '#eee'
    },
    tabBar: {
      color: '#a9b7b7',
      selectedColor: '#1296db',
      borderStyle: 'white',
      list: [{
          selectedIconPath: 'static/image/_home.png',
          iconPath: 'static/image/home.png',
          pagePath: 'pages/index/main',
          text: '首页'
        },
        {
          selectedIconPath: 'static/image/_map.png',
          iconPath: 'static/image/map.png',
          pagePath: 'pages/map/main',
          text: '附近'
        },
        {
          selectedIconPath: 'static/image/_mine.png',
          iconPath: 'static/image/mine.png',
          pagePath: 'pages/mine/main',
          text: '我的'
        }
      ]
    }
  }
}
