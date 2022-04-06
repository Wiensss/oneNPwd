const $ = getApp()
const { showToast } = $.require('./utils/promisify')
const { SERVER_ERROR } = $.require('./constants/api')
const { NOT_LOGIN, AUTH_PROFILE } = $.require('./constants/account')
const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],
  options: {
    addGlobalClass: true,
  },
  properties: {
    loading: {
      type: Boolean,
      value: false,
    },
    userInfo: {
      type: Object,
      value: null,
    },
  },
  data: {
    navBarHeight: `${$.globalData.customWindow.navBarHeight}px`,
    statusBarHeight: `${$.globalData.customWindow.statusBarHeight}px`,
  },
  computed: {
    username(data) {
      return data.userInfo?.nickName || NOT_LOGIN
    },
  },
  methods: {
    openDrawer() {
      console.log('open drawer')
    },
    async getUserProfile() {
      try {
        const { userInfo } = await wx.getUserProfile({ desc: AUTH_PROFILE })

        if (!userInfo) throw new Error()

        this.triggerEvent('getUserInfo', { ...userInfo })
      } catch ({ message }) {
        showToast({ title: SERVER_ERROR }, message)
      }
    },
  },
})
