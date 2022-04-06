const $ = getApp()
const { THEME_COLOR } = $.require('./constants/global')

Component({
  properties: {
    icon: String,
    size: {
      type: String,
      value: '40rpx',
    },
    color: {
      type: String,
      value: THEME_COLOR,
    },
  },
  methods: {
    onTap() {
      this.triggerEvent('tap', this.data.icon)
    },
  },
})
