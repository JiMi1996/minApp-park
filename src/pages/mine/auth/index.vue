<template>
  <div class="container" v-bind:style="{height: viewHeight + 'px'}">
    <button class="auth-button" size="default" open-type="getUserInfo" @getuserinfo="onGotUserInfo">点击认证</button>
    <div class="page">
      <div class="weui-footer">
        <navigator open-type="navigate" url="../agreement/main" class="weui-footer__text">同意《
          <span>服务协议</span> 》</navigator>
      </div>
    </div>
  </div>
</template>

<script>
import env from '@/env'
export default {
  data() {
    return {
      target: '../main'
    }
  },
  watch: {},
  computed: {
    viewHeight() {
      return env.state.deviceInfo.windowHeight
    }
  },
  methods: {
    onGotUserInfo() {
      var thisTarget = this.target
      wx.getUserInfo({
        withCredentials: true,
        success: function(res) {
          env.dispatch('bindUserDetail', res.userInfo)
          wx.redirectTo({
            url: thisTarget
          })
        }
      })
    }
  },
  mounted() {},
  onLoad: function(options) {
    this.target = options.target
  }
}
</script>

<style>
.container {
  background-color: #1296db;
}

page {
  background-color: #1296db;
}

button::after {
  border: 0;
}

.auth-button {
  padding: 150px 20px 0 20px;
  background-color: #1296db;
  color: #fff;
  font-size: 16px;
}

.weui-footer navigator {
  color: white;
}

.weui-footer navigator span {
  text-decoration: underline;
}
</style>
