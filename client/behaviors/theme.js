module.exports = Behavior({
  data: {
    theme: wx.getStorageSync('theme')
  },

  attached() {
    this.renderTheme(this.data.theme)
  },

  methods: {
    triggerTheme() {
      const theme = this.data.theme === 'dark' ? 'light' : 'dark'

      this.setData({ theme })
      this.renderTheme(theme)

      wx.setStorageSync('theme', theme)
    },

    renderTheme(theme) {
      wx.setNavigationBarColor({
        frontColor: theme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: theme === 'dark' ? '#0a0a0a' : '#f5f5f5'
      })

      wx.setBackgroundTextStyle({
        textStyle: theme === 'dark' ? 'light' : 'dark'
      })

      wx.setBackgroundColor({
        backgroundColor: theme === 'dark' ? '#191919' : '#ededed',
        backgroundColorTop: theme === 'dark' ? '#191919' : '#ededed',
        backgroundColorBottom: theme === 'dark' ? '#191919' : '#ededed'
      })
    },

    diffTheme() {
      const { theme } = this.data
      const curTheme = wx.getStorageSync('theme')

      if (!theme || theme !== curTheme) {
        this.renderTheme(curTheme)
        this.setData({ theme: curTheme })
      }
    }
  }
})
