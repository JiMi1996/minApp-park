import env from '@/env'
var Fly = require('flyio/dist/npm/wx')
var fly = new Fly()

fly.config.baseURL = 'https://app.lhzh.tech'

fly.interceptors.request.use((request) => {
  console.log('fly request', request)
  if (env.state.session.access_token !== undefined) {
    request.headers['Authorization'] = 'Bearer ' + env.state.session.access_token
    request.headers['Content-Type'] = 'application/json'
  }
  wx.showLoading({
    title: '加载中'
  })
  // 请求体
  return request
})

fly.interceptors.response.use(
  (response, promise) => {
    console.log('fly response', response.data)
    wx.hideLoading()
    if (response.data.success === true) {
      return response.data
    } else if (response.data.success === false) {
      wx.showToast({
        title: 'ERROR[' + response.data.errorCode + ']' + response.data.message,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return response.data
    } else {
      return response
    }
  },
  (error, promise) => {
    wx.hideLoading()
    wx.showToast({
      title: 'ERROR[' + error.status + ']' + error.response.data,
      icon: 'none',
      duration: 2000,
      mask: true
    })
    console.log('fly error', error)
  }
)
export default fly
