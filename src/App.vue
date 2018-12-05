<script>
import env from './env'

export default {
  created() {
    // 获取设备信息
    wx.getSystemInfo({
      success: res => {
        console.log('device info', res)
        env.commit('setDeviceInfo', res)
      }
    })

    // 获取位置
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        console.log('position info', res)
        env.commit('setLocation', res)
        env.dispatch('reverseGeocoder', {
          location: res
        })
      }
    })
    // 登陆
    wx.login({
      success: res => {
        console.log('login info', res)
        env.dispatch('login', res)
      }
    })
  }
}
</script>

<style>
.container {
  height: 100%;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: #eee;
}

/* this rule will be remove */

* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
