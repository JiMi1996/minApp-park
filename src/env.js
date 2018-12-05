// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import qs from 'qs'
import fly from '@/fly'
import QQMapWX from '@/libs/qqmap-wx-jssdk'
import {
  getCityCode
} from '@/utils/index'

Vue.use(Vuex)

const MAP_KEY = 'PD7BZ-CIT3F-GNXJ3-JMBCG-Q6E6V-4HFUC'

var qqmap = new QQMapWX({
  key: MAP_KEY
})

const env = new Vuex.Store({
  state: {
    // 搜索类型
    searchType: {
      src: '../../static/image/map/park.png',
      name: '停车场'
    },
    // 当前位置
    location: {},
    // 位置描述
    address: {},
    // 车牌简称
    cityCode: '',
    // 设备信息
    deviceInfo: {},
    // 用户信息
    userInfo: {},
    // 服务器session
    session: {},
    // 搜索节点列表
    nodeList: [],
    // 车牌列表
    carList: [],
    // 地址搜索列表
    suggestion: {},
    // 当前节点
    currentNode: {},
    // 服务器时间
    serverTime: 0,
    // 最近停车记录
    lastCarFee: {},
    // 最近使用停车场
    lastPark: {}
  },
  mutations: {
    setSearchType: (state, payload) => {
      state.searchType = payload
    },
    setAddress: (state, payload) => {
      state.address = payload
    },
    setDeviceInfo: (state, payload) => {
      state.deviceInfo = payload
    },
    setLocation: (state, payload) => {
      state.location = payload
    },
    setUserInfo: (state, payload) => {
      state.userInfo = payload
    },
    setCurrentNode: (state, payload) => {
      state.currentNode = payload
    },
    setServerTime: (state, payload) => {
      state.serverTime = payload
    },
    setSuggestion: (state, payload) => {
      state.suggestion = payload
    },
    setCityCode: (state, payload) => {
      state.cityCode = payload
    },
    setCarList: (state, payload) => {
      state.carList = payload
    },
    addCar: (state, payload) => {
      state.carList.push(payload)
    },
    removeCar: (state, payload) => {
      for (var i = 0; i < state.carList.length; i++) {
        if (state.carList[i].carNumber === payload) {
          state.carList.splice(i, 1)
          break
        }
      }
    },
    setLastCarFee: (state, payload) => {
      state.lastCarFee = payload
    },
    setLastPark: (state, payload) => {
      state.lastPark = payload
    }
  },
  actions: {
    // 获取地图搜索结果列表
    getNodeList({
      commit,
      state
    }, payload) {
      qqmap.search({
        location: payload.location,
        keyword: payload.name,
        page_size: 20,
        address_format: 'short',
        success: function (res) {
          console.log('map', res)
          state.nodeList = res.data
        },
        fail: function (res) {
          console.log('map error', res)
        }
      })
    },
    // 搜索建议
    getAddressSuggestion({
      commit,
      state
    }, payload) {
      qqmap.getSuggestion({
        keyword: payload.name,
        region: state.address.city,
        region_fix: 1,
        success: function (res) {
          console.log('map suggestion', res.data)
          commit('setSuggestion', res)
        },
        fail: function (res) {
          console.log('map suggestion error', res)
        }
      })
    },
    // 反向地址查询
    reverseGeocoder({
      commit,
      state
    }, payload) {
      qqmap.reverseGeocoder({
        location: payload.location,
        success: function (res) {
          console.log('map search', res.result.address_component)
          commit('setCityCode', getCityCode(res.result.address_component.city))
          commit('setAddress', res.result.address_component)
        },
        fail: function (res) {
          console.log('map search error', res)
        }
      })
    },
    // 登陆
    login({
      commit,
      state
    }, payload) {
      fly.post('/oauth/token', qs.stringify({
        client_id: 'client',
        client_secret: 'security',
        grant_type: 'password',
        auth_type: 'wx_app',
        username: '?',
        password: payload.code
      })).then((result) => {
        state.session = result.data
        this.dispatch('fetchUserDetail')
      })
    },
    // 绑定信息
    fetchUserDetail({
      commit,
      state
    }) {
      fly.get('/me/info/').then((result) => {
        this.commit('setUserInfo', result.data)
        this.dispatch('getCarList')
      })
    },
    // 绑定信息
    bindUserDetail({
      commit,
      state
    }, payload) {
      fly.put('/me/info/bind_wx', payload).then((result) => {
        this.commit('setUserInfo', result.data)
      })
    },
    // 获取服务器时间
    getServerTime({
      commit,
      state
    }, payload) {
      fly.get('/server/time', payload).then((result) => {
        this.commit('setServerTime', result.data)
      })
    },
    // 车牌列表
    getCarList({
      commit,
      state
    }) {
      fly.get('/me/park/car_list').then((result) => {
        this.commit('setCarList', result.data)
        this.dispatch('getLastCarFee')
      })
    },
    // 最近停车记录
    getLastCarFee({
      commit,
      state
    }) {
      fly.get('/me/park/last_car_fee').then((result) => {
        this.commit('setLastCarFee', result.data)
        if (result.data && !result.data.paymentTime) {
          wx.showModal({
            title: '待缴费车辆',
            content: result.data.carNumber,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/mine/car_fee/main?type=car_fee_unpaid_list'
                })
              }
            }
          })
        }
        if (result.dictionary && result.dictionary.park) {
          this.commit('setLastPark', result.dictionary.park)
        }
      })
    },
    // 绑定车牌
    addCar({
      commit,
      state
    }, payload) {
      fly.post('/me/park/add_car?number=' + payload).then((result) => {
        this.commit('addCar', result.data)
        wx.redirectTo({
          url: '../car_list/main'
        })
        wx.showToast({
          title: '绑定成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      })
    },
    // 取消绑定车牌
    removeCar({
      commit,
      state
    }, payload) {
      fly.delete('/me/park/remove_car?number=' + payload).then((result) => {
        this.commit('removeCar', payload)
      })
    }
  }
})

export default env
