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
        backgroundColor: theme === 'dark' ? '#050505' : '#ffffff'
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
