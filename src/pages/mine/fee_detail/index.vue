<template>
  <div class="container">
    <div class="weui-form-preview">
      <div class="weui-form-preview__hd">
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">付款金额</div>
          <div class="weui-form-preview__value_in-hd">¥{{detail.paymentAmount}}</div>
        </div>
      </div>
      <div class="weui-form-preview__bd">
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">停车场</div>
          <div class="weui-form-preview__value">{{detail.park.name}}</div>
        </div>
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">付费方式</div>
          <div class="weui-form-preview__value">{{detail.paymentMode}}</div>
        </div>
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">入场时间</div>
          <div class="weui-form-preview__value">{{detail.inTimeString}}</div>
        </div>
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">支付时间</div>
          <div class="weui-form-preview__value">{{detail.paymentTimeString}}</div>
        </div>
        <div class="weui-form-preview__item">
          <div class="weui-form-preview__label">离开时间</div>
          <div class="weui-form-preview__value">{{detail.outTimeString}}</div>
        </div>
      </div>
      <div class="weui-form-preview__ft">
        <navigator open-type="navigateBack" class="weui-form-preview__btn weui-form-preview__btn_primary" hover-class="weui-form-preview__btn_active">返回</navigator>
      </div>
    </div>
  </div>
</template>

<script>
import env from '@/env'
export default {
  data() {
    return {
      detail: {}
    }
  },
  watch: {},
  computed: {
    viewHeight() {
      return env.state.deviceInfo.windowHeight
    }
  },
  methods: {},
  onLoad: function(options) {
    this.detail = JSON.parse(options.detail)
  },
  mounted() {}
}
</script>

<style>
</style>
