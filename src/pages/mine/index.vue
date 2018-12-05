<template>
  <div class="container" v-bind:style="{height: viewHeight + 'px'}">
    <div class="userinfo">
      <open-data class="userinfo-avatar" type="userAvatarUrl" background-size="cover"></open-data>
      <div class="userinfo-nickname">
        <open-data type="userNickName"></open-data>
      </div>
    </div>

    <div v-if="!userInfo.nickname" class="weui-cells weui-cells_after-title">
      <navigator open-type="navigate" url="auth/main?target=../car_fee/main?type=car_fee_paid_list" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <div class="weui-cell__bd">停车记录</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator open-type="navigate" url="auth/main?target=../car_list/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <div class="weui-cell__bd">车辆管理</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
    </div>

    <div v-if="userInfo.nickname" class="weui-cells weui-cells_after-title">
      <navigator open-type="navigate" url="car_fee/main?type=car_fee_paid_list" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <div class="weui-cell__bd">停车记录</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <navigator open-type="navigate" url="car_list/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <div class="weui-cell__bd">车辆管理</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
    </div>

    <div class="weui-cells__title"></div>
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <button open-type="contact" class="weui-cell__bd">在线客服</button>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </div>
      <navigator open-type="navigate" url="agreement/main" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <div class="weui-cell__bd">服务协议</div>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </navigator>
      <div class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <button open-type="share" class="weui-cell__bd">邀请好友</button>
        <div class="weui-cell__ft weui-cell__ft_in-access"></div>
      </div>
    </div>

    <div class="page">
      <div class="weui-footer">
        <div class="weui-footer__text">Copyright © 2017-2018 LinHaiZhiHui Co.,Ltd.</div>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import env from '@/env'

export default {
  components: {
    card
  },
  computed: {
    viewHeight() {
      return env.state.deviceInfo.windowHeight
    },
    userInfo() {
      return env.state.userInfo
    }
  },
  data() {
    return {
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    }
  },
  methods: {
    onGotUserInfo() {
      wx.getUserInfo({
        withCredentials: true,
        success: function(res) {
          env.dispatch('bindUserDetail', res.userInfo)
        }
      })
    }
  },
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      console.log('share', ops.target)
    }
    return {
      title: '停车一步到位',
      path: '/pages/index/main',
      success: function(res) {
        console.log('share success', JSON.stringify(res))
      },
      fail: function(res) {
        console.log('share error', JSON.stringify(res))
      }
    }
  },
  onReady() {}
}
</script>

<style>
.weui-cell button {
  background-color: white;
  border: none;
  padding: 0;
  margin: 0;
  text-align: left;
  line-height: unset;
}

button::after {
  border: 0;
}

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
  border-radius: 50%;
  clip-path: circle(64rpx at center);
}

.userinfo-nickname {
  color: #fff;
  padding: 5px;
}

.weui-footer navigator span {
  text-decoration: underline;
}
</style>
