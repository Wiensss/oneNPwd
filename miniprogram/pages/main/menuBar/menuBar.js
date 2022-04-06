const $ = getApp()
const noopBehavior = $.require('./behaviors/noop')
const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [noopBehavior, computedBehavior],
  options: {
    addGlobalClass: true,
  },
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    theme: {
      type: String,
      value: 'light',
    },
  },
  computed: {
    isDark(data) {
      return data.theme === 'dark'
    },
  },
  methods: {
    hideMenu() {
      this.setData({ visible: false })
    },
    changeTheme({ detail }) {
      this.setData({ theme: detail.value ? 'dark' : 'light' })
    },
  },
})
