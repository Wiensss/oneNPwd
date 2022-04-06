const { THEME } = require('./constants/global')

App({
  async onLaunch() {
    this.globalData = {}
    this.setGlobalData = (field, value) => {
      this.globalData[field] = value
    }

    this.initCustomStyle()
    await this.initcloud()
  },

  require(path) {
    return require(`${path}`)
  },

  flag: false,
  async initcloud() {
    const shareinfo = wx.getExtConfigSync()
    const normalinfo = require('./envList.js').envList || []

    // environment sharing development
    if (shareinfo.envid) {
      this.cloudInstance = new wx.cloud.Cloud({
        resourceAppid: shareinfo.appid,
        resourceEnv: shareinfo.envid,
      })

      this.cloud = async function () {
        if (!this.flag) {
          await this.cloudInstance.init()
          this.flag = true
        }
      }

      return
    }

    // normal cloud development
    if (normalinfo.length && normalinfo[0].envId)
      wx.cloud.init({
        traceUser: true,
        env: normalinfo[0].envId,
      })
  },

  initCustomStyle() {
    const { theme, screenWidth, statusBarHeight } = wx.getSystemInfoSync()

    this.setGlobalData('customWindow', {
      statusBarHeight,
      navBarHeight: (screenWidth / 750) * 120 + 50,
    })

    wx.setStorageSync(THEME, wx.getStorageSync(THEME) || theme)
  },
})
