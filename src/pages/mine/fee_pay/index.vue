<template>
  <div class="container">
    <div class="weui-form-preview">
      <div class="weui-form-preview__hd">
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">停车费</div>
          <div class="weui-form-preview__value_in-hd">¥{{money}}</div>
        </div>
      </div>
      <div class="weui-form-preview__bd">
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">停车场</div>
          <div class="weui-form-preview__value">{{detail.park.name}}</div>
        </div>
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">入场时间</div>
          <div class="weui-form-preview__value">{{detail.inTimeString}}</div>
        </div>
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">当前时间</div>
          <div class="weui-form-preview__value">{{serverTime}}</div>
        </div>
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">计费规则</div>
          <div class="weui-form-preview__value">{{detail.fee.comment}}</div>
        </div>
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">时长</div>
          <div v-if="duration.days" class="weui-form-preview__value">{{duration.days}}天{{duration.hours}}小时{{duration.minutes}}分钟</div>
          <div v-if="!duration.days && duration.hours" class="weui-form-preview__value">{{duration.hours}}小时{{duration.minutes}}分钟</div>
          <div v-if="!duration.days && !duration.hours" class="weui-form-preview__value">{{duration.minutes}}分钟</div>
        </div>
      </div>
      <div class="weui-form-preview__ft">
        <div v-if="money!==''" @click="pay()" class="weui-form-preview__btn weui-form-preview__btn_primary" hover-class="weui-form-preview__btn_active">缴费</div>
        <div v-if="money===''" class="weui-form-preview__btn weui-form-preview__btn_primary" hover-class="weui-form-preview__btn_active">查询中……</div>
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
      money: '',
      detail: {}
    }
  },
  watch: {},
  computed: {
    viewHeight() {
      return env.state.deviceInfo.windowHeight
    },
    duration() {
      var duration = {}
      if (env.state.serverTime) {
        let seconds = parseInt(
          (env.state.serverTime - this.detail.inTime) / 1000
        )
        duration.days = parseInt(seconds / (24 * 3600))
        duration.hours = parseInt((seconds - duration.days * 24 * 3600) / 3600)
        duration.minutes = parseInt(
          (seconds - duration.days * 24 * 3600 - duration.hours * 3600) / 60
        )
      }
      return duration
    },
    serverTime() {
      if (env.state.serverTime === 0) {
        return '-'
      } else {
        return formatTime(new Date(env.state.serverTime))
      }
    }
  },
  methods: {
    tick: function() {
      if (env.state.serverTime > 0) {
        env.commit('setServerTime', env.state.serverTime + 1000)
        let fee = this.detail.fee
        let seconds = parseInt(
          (env.state.serverTime - this.detail.inTime) / 1000
        )
        let minutes = parseInt(seconds / 60)
        if (fee.isFree) {
          this.money = 0
        } else if (fee.freeMinutes > minutes) {
          this.money = 0
        } else if (seconds % 120 === 0) {
          let url = '/me/park/pay/price?carFee=' + this.detail.id
          fly.get(url).then(result => {
            this.money = result.data
          })
        }
      }
    },
    pay: function() {
      let url = '/me/park/pay?carFee=' + this.detail.id
      let thatDetail = this.detail
      fly.post(url).then(result => {
        if (result.data.money === 0 || result.data.money === '0') {
          wx.showModal({
            title: '免费出场',
            content: thatDetail.carNumber,
            showCancel: false,
            success: function(res) {
              wx.reLaunch({
                url: '../../index/main'
              })
            }
          })
        } else {
          wx.requestPayment({
            timeStamp: result.data.timeStamp,
            nonceStr: result.data.nonceStr,
            package: result.data.package,
            signType: result.data.signType,
            paySign: result.data.paySign,
            success: function(res) {
              wx.showModal({
                title: '支付成功',
                content: thatDetail.carNumber,
                showCancel: false,
                success: function(res) {
                  wx.reLaunch({
                    url: '../../index/main'
                  })
                }
              })
            },
            fail: function(res) {
              if (res.errMsg === 'requestPayment:fail cancel') {
                res.errMsg = '取消支付'
              }
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          })
        }
      })
    }
  },
  mounted() {},
  onLoad(options) {
    this.money = ''
    this.detail = JSON.parse(options.detail)
    env.dispatch('getServerTime')
    this.$nextTick(function() {
      this.timer = setInterval(this.tick, 1000)
    })
    let url = '/me/park/pay/price?carFee=' + this.detail.id
    fly.get(url).then(result => {
      this.money = result.data
    })
  },
  onUnload() {
    clearInterval(this.timer)
  },
  onShow() {}
}
</script>

<style>
</style>
