<template>
  <div class="container">
    <div v-if="feeList.length === 0" class="zero-tip">暂无记录</div>
    <div v-for="(fee, index) in feeList" :key="index" class="weui-panel weui-panel_access">
      <div class="weui-panel__hd">{{fee.park.name}}
        <span>{{fee.carNumber}}</span>
      </div>
      <div class="weui-panel__bd">
        <div class="weui-media-box weui-media-box_appmsg">
          <div class="weui-media-box__bd weui-media-box__bd_in-appmsg car-number weui-flex">
            <p class="weui-flex__item" maxlength="1" value="">{{fee.inTimeString}}</p>
            <p class="weui-flex__item" maxlength="1" value="">-</p>
            <p class="weui-flex__item" v-if="!fee.outTime" maxlength="1" value="">?</p>
            <p class="weui-flex__item" v-if="fee.outTime" maxlength="1" value="">{{fee.outTimeString}}</p>
          </div>
        </div>
      </div>
      <div class="weui-panel__ft">
        <div class="weui-cell weui-cell_access weui-cell_link">
          <div @click="detail(fee)" style="color:green;" v-if="!fee.paymentTime" class="weui-cell__bd">快速缴费</div>
          <div @click="detail(fee)" style="color:#1296db;" v-if="fee.paymentTime" class="weui-cell__bd">缴费详情</div>
          <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import env from '@/env'
import fly from '@/fly'
import { formatTime } from '@/utils/index'
export default {
  data() {
    return {
      page: 1,
      feeList: []
    }
  },
  watch: {},
  computed: {
    viewHeight() {
      return env.state.deviceInfo.screenHeight
    }
  },
  methods: {
    detail(fee) {
      if (fee.paymentTime) {
        wx.navigateTo({
          url: '../fee_detail/main?detail=' + JSON.stringify(fee)
        })
      } else {
        wx.navigateTo({
          url: '../fee_pay/main?detail=' + JSON.stringify(fee)
        })
      }
    }
  },
  onLoad: function(options) {
    this.feeList = []
    this.type = options.type ? options.type : 'car_fee_unpaid_list'
    this.car = options.car
    var url = '/me/park/' + this.type + '/' + this.page
    if (this.car && this.type === 'car_fee_paid_list') {
      url = url + '?number=' + this.car
    }
    fly.get(url).then(result => {
      if (result.data.length !== 0) {
        var parkMap = []
        var feeMap = []
        result.dictionary.park.forEach(function(value, index, data) {
          parkMap[value.id] = value
        })
        result.dictionary.fee.forEach(function(value, index, data) {
          feeMap[value.id] = value
        })
        result.data.forEach(function(value, index, data) {
          if (value.inTime) {
            value.inTimeString = formatTime(new Date(value.inTime))
          } else {
            value.inTimeString = ''
          }
          if (value.outTime) {
            value.outTimeString = formatTime(new Date(value.outTime))
          } else {
            value.outTimeString = ''
          }
          if (value.paymentTime) {
            value.paymentTimeString = formatTime(new Date(value.paymentTime))
          } else {
            value.paymentTimeString = ''
          }
          value.park = parkMap[value.parkId]
          value.fee = feeMap[value.park.feeId]
        })
        this.feeList = result.data
      }
    })
  },
  mounted() {}
}
</script>

<style>
.car-number {
  text-align: center;
}

.car-number p {
  width: 50px;
  line-height: 30px;
  margin: 5px;
  padding: 0px;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}

.weui-panel__hd span {
  float: right;
  border-radius: 0px;
  border-width: 0px;
  border-radius: 0px;
  color: lightgray;
  margin-right: 5px;
}

.zero-tip {
  margin: 10px;
  font-size: 12px;
  text-align: center;
  color: gray;
}

page {
  display: block;
  min-height: 100%;
  background-color: #eee;
}
</style>
