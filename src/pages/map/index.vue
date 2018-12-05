<template>
  <div class="map-warp" v-bind:style="{height: mapHeight + 'px'}">
    <map id="myMap" :animation="mapAnimation" class="map" show-location="true" :markers="markList" @tap="mapTap($event)" @markertap="markerTap($event)" @controltap="controltap($event)" :controls="controls"></map>
    <div v-if="!showDetail" class="header" @click="change()">{{splitText}}</div>
    <div v-if="showDetail" class="header" @click="change()">返回</div>
    <scroll-view :upper-threshold="100" :lower-threshold="100" scroll-y="true" v-bind:style="{height: mapHeight/2 - 22 + 'px'}">
      <div v-if="showDetail" class="weui-form-preview">
        <div class="weui-form-preview__hd">
          <div class="weui-form-preview__item">
            <div class="weui-form-preview__label"></div>
            <div class="weui-form-preview__value_in-hd">{{currentNode.title}}</div>
          </div>
        </div>
        <div class="weui-form-preview__bd">
          <div class="weui-form-preview__item">
            <div class="weui-form-preview__label">地点</div>
            <div class="weui-form-preview__value">{{currentNode.address}}</div>
          </div>
          <div class="weui-form-preview__item">
            <div class="weui-form-preview__label">距离</div>
            <div class="weui-form-preview__value">{{currentNode._distance}}米</div>
          </div>
          <div class="weui-form-preview__item">
            <div class="weui-form-preview__label">电话</div>
            <div class="weui-form-preview__value">{{currentNode.tel}}</div>
          </div>
        </div>
        <div class="weui-form-preview__ft">
          <button open-type="contact" class="no-button weui-form-preview__btn weui-form-preview__btn_primary" hover-class="weui-form-preview__btn_active">客服</button>
          <button @click="navigate" class="no-button weui-form-preview__btn weui-form-preview__btn_primary" hover-class="weui-form-preview__btn_active">导航</button>
        </div>
      </div>
      <div v-if="!showDetail" class="weui-panel weui-panel_access">
        <div class="weui-panel__bd">
          <div v-for="(marker, index) in markList" :key="index" @click="detail(marker)" url="" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
            <div class="weui-cell__bd node_info">
              {{marker.title}}
              <span>距离{{marker.distance}}米，{{marker.address}}
              </span>
            </div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
// Use Vuex
import { formatMarker } from '@/utils/index'
import env from '@/env'

export default {
  data() {
    return {
      splitText: '展开',
      mapAnimation: '',
      animation: {
        duration: 200,
        timingFunction: 'linear',
        delay: 0,
        transformOrigin: 'left top 0'
      },
      // 地图控件
      controls: [
        {
          id: 1,
          iconPath: '../../static/image/map/return.png',
          position: {
            left: env.state.deviceInfo.windowWidth - 50,
            top: 20,
            width: 30,
            height: 30
          },
          clickable: true
        },
        {
          id: 2,
          iconPath: '../../static/image/map/search.png',
          position: {
            left: env.state.deviceInfo.windowWidth / 2 - 50,
            top: 20,
            width: 99,
            height: 24
          },
          clickable: true
        }
      ]
    }
  },
  computed: {
    currentNode() {
      return env.state.currentNode
    },
    showDetail() {
      var show = env.state.currentNode.location != null
      if (show) {
        this.upper()
      }
      return show
    },
    markList() {
      return env.state.nodeList.map(node =>
        formatMarker(node, env.state.searchType.src)
      )
    },
    mapHeight() {
      return env.state.deviceInfo.windowHeight
    }
  },
  onShow() {
    this.mapControl = wx.createMapContext('myMap')
    if (this.currentNode.location) {
      this._moveMap(this.currentNode)
    } else {
      this.mapControl.moveToLocation()
    }
    this.upper()
  },
  methods: {
    // 移动地图
    _moveMap(node) {
      this.mapControl.includePoints({
        padding: [10],
        points: [
          {
            latitude: node.location.lat,
            longitude: node.location.lng
          },
          {
            latitude: node.location.lat + 0.001,
            longitude: node.location.lng + 0.001
          },
          {
            latitude: node.location.lat - 0.001,
            longitude: node.location.lng - 0.001
          }
        ]
      })
    },
    // 导航按钮
    navigate() {
      wx.openLocation({
        latitude: env.state.currentNode.location.lat,
        longitude: env.state.currentNode.location.lng,
        scale: 14,
        name: env.state.currentNode.title,
        address: env.state.currentNode.address
      })
    },
    // 列表详情
    detail(marker) {
      env.state.nodeList.forEach(item => {
        if (item.id === marker.id) {
          env.commit('setCurrentNode', item)
          this._moveMap(item)
        }
      })
    },
    // 分隔栏状态切换
    change() {
      if (this.currentNode.location) {
        env.commit('setCurrentNode', {})
      } else {
        if (this.splitText === '隐藏') {
          this.lower()
        } else {
          this.upper()
        }
      }
    },
    // 列表隐藏动画
    lower() {
      this.mapAnimation = wx.createAnimation(this.animation)
      this.mapAnimation.height(env.state.deviceInfo.windowHeight - 22).step()
      this.mapAnimation = this.mapAnimation.export()
      this.splitText = '展开'
    },
    // 列表显示动画
    upper() {
      this.mapAnimation = wx.createAnimation(this.animation)
      this.mapAnimation.height(env.state.deviceInfo.windowHeight / 2).step()
      this.mapAnimation = this.mapAnimation.export()
      this.splitText = '隐藏'
    },
    // 点击地图空白区域
    mapTap(event) {
      env.commit('setCurrentNode', {})
    },
    // 点击地图标注
    markerTap(event) {
      env.state.nodeList.forEach(item => {
        if (item.id === event.mp.markerId) {
          env.commit('setCurrentNode', item)
          this.upper()
        }
      })
    },
    // 点击地图控件
    controltap(event) {
      if (event.mp.controlId === 1) {
        this.mapControl.moveToLocation()
      } else {
        this.mapControl.getCenterLocation({
          success: function(res) {
            env.dispatch('getNodeList', {
              name: env.state.searchType.name,
              location: res
            })
          }
        })
      }
    }
  }
}
</script>
<style>
.map {
  width: 100%;
  height: 0;
}

.header {
  font-size: 14px;
  border-top: 1rpx solid #d9d9d9;
  padding: 3px;
}

.node_info {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
}

.no-button {
  background-color: initial;
  font-size: initial;
  margin: 0;
  padding: 0;
}

.node_info span {
  color: #bbb;
}

.map-warp {
  text-align: center;
  overflow: hidden;
}
</style>
