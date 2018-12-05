-<template>
  <div class="container">
    <div class="weui-search-bar">
      <div class="weui-search-bar__form">
        <div class="weui-search-bar__box">
          <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
          <input type="text" class="weui-search-bar__input" placeholder="搜索" confirm-type="search" v-model="inputVal" :focus="inputShowed"
            @blur="inputBlur" @input="inputTyping" />
          <div class="weui-icon-clear" v-if="inputVal.length > 0" @click="clearInput">
            <icon type="clear" size="14"></icon>
          </div>
        </div>
        <label class="weui-search-bar__label" :hidden="inputShowed" @click="showInput">
          <icon class="weui-icon-search" type="search" size="14"></icon>
          <div class="weui-search-bar__text">搜索</div>
        </label>
      </div>
      <div class="weui-search-bar__cancel-btn" :hidden="!inputShowed" @click="hideInput">取消</div>
    </div>
    <!-- 地址搜索  start -->
    <div v-if="suggestion.count > 0" class="weui-panel weui-panel_access top">
      <div class="weui-panel__hd">搜索结果</div>
      <div class="weui-panel__bd">
        <div @click="navigate(result)" v-for="(result, index) in suggestion.data" :key="index" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active">
          <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
            <div class="weui-media-box__title">{{result.title}}</div>
            <div class="weui-media-box__desc">{{result.address}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!suggestion.count" class="weui-grids">
      <block v-for="(item, index) in grids" :key="index">
        <div @click="func(item.name)" class="weui-grid" hover-class="weui-grid_active">
          <image class="weui-grid__icon" :src="item.src" />
          <div class="weui-grid__label">{{item.name}}</div>
        </div>
      </block>
    </div>
    <!-- 停车记录  start -->
    <div v-if="!suggestion.count" class="weui-panel weui-panel_access">
      <div class="weui-panel__hd">停车记录
        <span v-if="userInfo.nickname" @click="refresh()" class="right">刷新</span>
      </div>
      <div v-if="userInfo.nickname" class="weui-panel__bd">
        <navigator v-if="!lastCarFee" open-type="navigate" url="../mine/car_list/main" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active">
          <div class="weui-media-box__hd weui-media-box__hd_in-appmsg">
            <image class="weui-media-box__thumb" src="../../static/image/function/car.png" />
          </div>
          <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
            <div class="weui-media-box__title">（暂无停车记录）</div>
          </div>
        </navigator>
        <navigator v-if="lastCarFee && lastCarFee.paymentTime" open-type="navigate" url="../mine/car_fee/main?type=car_fee_paid_list" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active">
          <div class="weui-media-box__hd weui-media-box__hd_in-appmsg">
            <image class="weui-media-box__thumb" src="../../static/image/function/car.png" />
          </div>
          <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
            <div class="weui-media-box__title">{{lastCarFee.carNumber}}</div>
            <div class="weui-media-box__desc">{{lastParkTime}}</div>
          </div>
        </navigator>
        <navigator v-if="lastCarFee && !lastCarFee.paymentTime" open-type="navigate" url="../mine/car_fee/main?type=car_fee_unpaid_list" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active">
          <div class="weui-media-box__hd weui-media-box__hd_in-appmsg">
            <image class="weui-media-box__thumb" src="../../static/image/function/car.png" />
          </div>
          <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
            <div class="weui-media-box__title">{{lastCarFee.carNumber}}</div>
            <div class="weui-media-box__desc">{{lastParkTime}}</div>
          </div>
        </navigator>
      </div>
      <div v-if="!userInfo.nickname" class="weui-panel__bd">
        <navigator open-type="navigate" url="../mine/auth/main?target=../car_list/main" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active">
          <div class="weui-media-box__hd weui-media-box__hd_in-appmsg">
            <image class="weui-media-box__thumb" src="../../static/image/function/car.png" />
          </div>
          <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
            <div class="weui-media-box__title">（绑定车牌，轻松停车）</div>
          </div>
        </navigator>
      </div>
      <div class="weui-panel__ft">
        <div class="weui-cell weui-cell_access weui-cell_link">
          <navigator v-if="userInfo.nickname" open-type="navigate" url="../mine/add_car/main" class="weui-cell__bd">新增车牌</navigator>
          <navigator v-if="!userInfo.nickname" open-type="navigate" url="../mine/auth/main?target=../add_car/main" class="weui-cell__bd">新增车牌</navigator>
          <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </div>
      </div>
    </div>
    <!-- 寻找  start -->
    <div v-if="!suggestion.count" class="weui-panel weui-panel_access">
      <div class="weui-panel__hd">寻找</div>
      <div class="weui-panel__bd">
        <div class="weui-grids">
          <block v-for="(item, index) in finds" :key="index">
            <div @click="search(item)" class="weui-grid" hover-class="weui-grid_active">
              <image class="weui-grid__icon" :src="item.src" />
              <div class="weui-grid__label">{{item.name}}</div>
            </div>
          </block>
        </div>
      </div>
    </div>
    <!-- 停车推荐  start -->
    <div v-if="!suggestion.count" class="weui-panel weui-panel_access">
      <div class="weui-panel__hd">最近</div>
      <div class="weui-panel__bd">
        <navigator v-for="(marker, index) in markList" @click="setCurrent(marker.id)" :key="index" v-if="index < 4" open-type="switchTab" url="../map/main" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active">
          <div class="weui-media-box__hd weui-media-box__hd_in-appmsg">
            <image class="weui-media-box__thumb" :src="searchType.src" />
          </div>
          <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
            <div class="weui-media-box__title">{{marker.title}}</div>
            <div class="weui-media-box__desc">{{marker.address}}</div>
          </div>
        </navigator>
      </div>
      <div class="weui-panel__ft">
        <div class="weui-cell weui-cell_access weui-cell_link">
          <navigator open-type="switchTab" url="../map/main" class="weui-cell__bd">查看附近</navigator>
          <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatMarker, formatTime } from '@/utils/index'
import env from '@/env'

export default {
  computed: {
    markList() {
      return env.state.nodeList.map(node =>
        formatMarker(node, this.finds[0].src)
      )
    },
    searchType() {
      return env.state.searchType
    },
    suggestion() {
      return env.state.suggestion
    },
    userInfo() {
      return env.state.userInfo
    },
    lastCarFee() {
      return env.state.lastCarFee
    },
    lastPark() {
      return env.state.lastPark
    },
    lastParkTime() {
      if (env.state.lastCarFee && env.state.lastCarFee.inTime) {
        return formatTime(new Date(env.state.lastCarFee.inTime))
      } else {
        return ''
      }
    }
  },
  mounted() {
    env.dispatch('getNodeList', {
      name: this.finds[0].name
    })
  },
  data() {
    return {
      scrollTop: 100,
      grids: [
        {
          src: '../../static/image/function/weizhang.png',
          name: '违章查询'
        },
        {
          src: '../../static/image/function/youjia.png',
          name: '今日油价'
        },
        {
          src: '../../static/image/function/xianxing.png',
          name: '尾号限行'
        },
        {
          src: '../../static/image/function/gujia.png',
          name: '二手车估值'
        }
      ],
      finds: [
        {
          src: '../../static/image/map/park.png',
          name: '停车场'
        },
        {
          src: '../../static/image/map/hotel.png',
          name: '酒店'
        },
        {
          src: '../../static/image/map/ktv.png',
          name: '娱乐'
        },
        {
          src: '../../static/image/map/wc.png',
          name: '洗手间'
        }
      ],
      inputShowed: false,
      inputVal: ''
    }
  },
  methods: {
    func(name) {
      wx.showToast({
        title: '无认证车辆，无法使用' + name + '功能',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    },
    // 导航
    navigate(node) {
      wx.openLocation({
        latitude: node.location.lat,
        longitude: node.location.lng,
        scale: 14,
        name: node.title,
        address: node.address
      })
    },
    showInput() {
      this.inputShowed = true
    },
    setCurrent(id) {
      env.state.nodeList.forEach(item => {
        if (item.id === id) {
          env.commit('setCurrentNode', item)
        }
      })
    },
    refresh() {
      env.dispatch('getLastCarFee')
    },
    search(type) {
      env.commit('setSearchType', type)
      env.dispatch('getNodeList', {
        name: type.name
      })
    },
    hideInput() {
      this.inputVal = ''
      this.inputShowed = false
      env.commit('setSuggestion', {})
    },
    inputBlur() {
      if (this.inputVal === '') {
        this.inputShowed = false
        env.commit('setSuggestion', {})
      }
    },
    clearInput() {
      this.inputVal = ''
    },
    inputTyping(e) {
      this.inputVal = e.mp.detail.value
      env.dispatch('getAddressSuggestion', {
        name: this.inputVal
      })
    }
  },
  created() {}
}
</script>

<style scoped>
.top {
  margin-top: 0;
}

.right {
  float: right;
}
</style>
