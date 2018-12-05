<template>
  <div>
    <scroll-view scroll-y class="container" v-bind:style="{height: viewHeight - 90 + 'px'}">
      <div v-if="carList.length === 0" class="zero-tip">暂无记录</div>
      <div v-for="(car, index) in carList" :key="index" class="weui-panel weui-panel_access">
        <div class="weui-panel__hd" v-if="car.owner">已认证
          <span @click="deleteCarNumber(car)">x</span>
        </div>
        <div class="weui-panel__hd" @click="identify(car, $event)" v-if="!car.owner">未认证
          <span>x</span>
        </div>
        <div class="weui-panel__bd">
          <div class="weui-media-box weui-media-box_appmsg">
            <div class="weui-media-box__bd weui-media-box__bd_in-appmsg car-number weui-flex">
              <p class="weui-flex__item" maxlength="1" value="">{{car.carNumber[0]}}</p>
              <p class="weui-flex__item" maxlength="1" value="">{{car.carNumber[1]}}</p>
              <span class="weui-flex__item">●</span>
              <p class="weui-flex__item" maxlength="1" value="">{{car.carNumber[2]}}</p>
              <p class="weui-flex__item" maxlength="1" value="">{{car.carNumber[3]}}</p>
              <p class="weui-flex__item" maxlength="1" value="">{{car.carNumber[4]}}</p>
              <p class="weui-flex__item" maxlength="1" value="">{{car.carNumber[5]}}</p>
              <p class="weui-flex__item" maxlength="1" value="">{{car.carNumber[6]}}</p>
              <p v-if="car.carType === 'ELECTRIC_VEHICLE'" class="weui-flex__item" maxlength="1" value="">{{car.carNumber[7]}}</p>
            </div>
          </div>
        </div>
        <div class="weui-panel__ft">
          <div class="weui-cell weui-cell_access weui-cell_link">
            <div @click="navigateFee(car)" class="weui-cell__bd">停车记录</div>
            <div class="weui-cell__ft weui-cell__ft_in-access"></div>
          </div>
        </div>
      </div>
    </scroll-view>
    <navigator open-type="redirect" url="../add_car/main" class="btn">新增</navigator>
  </div>
</template>

<script>
import env from '@/env'
export default {
  data() {
    return {}
  },
  watch: {},
  computed: {
    viewHeight() {
      return (
        env.state.deviceInfo.screenHeight - env.state.deviceInfo.statusBarHeight
      )
    },
    viewWidth() {
      return env.state.deviceInfo.screenWidth
    },
    carList() {
      return env.state.carList
    }
  },
  methods: {
    deleteCarNumber(car) {
      wx.showModal({
        title: '解绑',
        content: car.carNumber,
        success: function(res) {
          if (res.confirm) {
            env.dispatch('removeCar', car.carNumber)
          }
        }
      })
    },
    identify(car, $event) {
      if (this.viewWidth - $event.x < 50) {
        this.deleteCarNumber(car)
        return
      }
      wx.showToast({
        title: '请上传车辆行驶证及驾照进行认证',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      wx.chooseImage({
        count: 3,
        success: function(res) {
          console.log('image upload', res.tempFilePaths)
          wx.showToast({
            title: '上传成功，请等待审核',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        },
        fail: function(error) {
          wx.showToast({
            title: '请求取消',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          console.warn(error)
        },
        complete: function() {}
      })
    },
    navigateFee(car) {
      wx.navigateTo({
        url: '../car_fee/main?type=car_fee_paid_list&car=' + car.carNumber
      })
    }
  },
  mounted() {},
  onLoad() {
    env.dispatch('getCarList')
  }
}
</script>

<style>
.car-number {
  text-align: center;
}

.car-number span {
  margin-top: 5px;
  margin-bottom: 5px;
  line-height: 50px;
  font-size: 10px;
}

.car-number p {
  width: 50px;
  height: 50px;
  vertical-align: middle;
  line-height: 50px;
  margin: 5px;
  padding: 0px;
  border-radius: 0px;
  border: #1296db 1px dashed;
  box-sizing: content-box;
}

.weui-panel__hd span {
  float: right;
  border-radius: 0px;
  border-width: 0px;
  border-radius: 0px;
  color: #ee7d82;
  margin-right: 5px;
}

.zero-tip {
  margin: 10px;
  font-size: 12px;
  text-align: center;
  color: gray;
}

.btn {
  width: 100%;
  border-radius: 3px;
  font-size: 18px;
  background-color: #1296db;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  color: white;
  overflow: hidden;
  height: 45px;
  bottom: 0;
  position: fixed;
}

page {
  display: block;
  min-height: 100%;
  background-color: #eee;
}
</style>
