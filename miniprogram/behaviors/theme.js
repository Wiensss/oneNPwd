const { THEME } = require('../constants/global')
const computedBehavior = require('miniprogram-computed').behavior

module.exports = Behavior({
  behaviors: [computedBehavior],
  data: {
    theme: wx.getStorageSync(THEME),
  },
  computed: {
    isDark(data) {
      return data.theme === 'dark'
    },
  },
  watch: {
    theme(newValue) {
      this.syncUpdateTheme(newValue)
    },
  },
  attached() {
    this.renderTheme()
  },
  methods: {
    syncUpdateTheme(theme) {
      this.renderTheme()
      wx.setStorageSync(THEME, theme)
    },
    renderTheme() {
      const { isDark } = this.data

      wx.setBackgroundTextStyle({
        textStyle: isDark ? 'light' : 'dark',
      })
      wx.setBackgroundColor({
        backgroundColor: isDark ? '#191919' : '#ededed',
        backgroundColorTop: isDark ? '#191919' : '#ededed',
        backgroundColorBottom: isDark ? '#191919' : '#ededed',
      })
      wx.setNavigationBarColor({
        backgroundColor: isDark ? '#191919' : '#ededed',
        frontColor: isDark ? '#ffffff' : '#000000',
      })
    },
  },
})
