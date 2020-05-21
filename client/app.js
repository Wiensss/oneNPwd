App({
  store: {},

  onLaunch() {
    if (!wx.cloud) console.error('使用 2.2.3 或以上的基础库')
    else
      wx.cloud.init({
        env: 'onen-pwd',
        traceUser: true
      })

    this.setCustomInfo()
  },

  setCustomInfo() {
    const { theme, screenWidth, statusBarHeight } = wx.getSystemInfoSync()

    this.store.statusBarHeight = statusBarHeight
    this.store.navBarHeight = (screenWidth / 750) * 120 + 10

    wx.setStorageSync('theme', wx.getStorageSync('theme') || theme)
  }
})
