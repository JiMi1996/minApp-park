<template>
  <div class="container">
    <div class="userinfo">
      <img class="userinfo-avatar" src="/static/image/vip.png"/>
      <div class="userinfo-nickname">
        <card :text="amount"></card>
      </div>
    </div>
    <div class="top weui-panel weui-panel_access">
      <div class="weui-panel__hd">合作停车场</div>
      <div class="weui-panel__bd">
        <navigator v-for="(marker, index) in markList" :key="index" open-type="navigate" url="../mine/car_fee/main" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active">
          <div class="weui-media-box__hd weui-media-box__hd_in-appmsg">
            <image class="weui-media-box__thumb" src="../../static/image/map/park.png" />
          </div>
          <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
            <div class="weui-media-box__title">{{marker.title}}</div>
            <div class="weui-media-box__desc">{{marker.address}}</div>
          </div>
        </navigator>
      </div>
      <div class="weui-panel__ft">
        <div class="weui-cell weui-cell_access weui-cell_link">
          <navigator class="weui-cell__bd">账户充值</navigator>
          <div class="weui-cell__ft weui-cell__ft_in-access"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  components: {
    card
  },
  data() {
    return {
      amount: '账户余额：0.0元',
      markList: [
        {
          title: 'A停车场',
          address: '地址'
        },
        {
          title: 'B停车场',
          address: '地址'
        },
        {
          title: 'C停车场',
          address: '地址'
        },
        {
          title: 'D停车场',
          address: '地址'
        }
      ]
    }
  },
  computed: {},
  onShow() {},
  methods: {}
}
</script>
<style>
.userinfo {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1296db;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin-top: 10rpx;
}

.userinfo-nickname {
  color: #fff;
}

.weui-footer navigator span {
  text-decoration: underline;
}

.top {
  margin-top: 0;
}
</style>
