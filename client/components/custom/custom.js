const app = getApp()

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    rotate: {
      type: Boolean,
      value: false
    },
    avatar: {
      type: String,
      value: ''
    },
    nickName: {
      type: String,
      value: ''
    }
  },

  data: {
    navBarHeight: app.store.navBarHeight + 'px',
    statusBarHeight: app.store.statusBarHeight + 'px'
  },

  methods: {
    getUserInfo(e) {
      this.triggerEvent('getuserinfo', e.detail, {})
    },

    openDrawer() {
      this.triggerEvent('open', {}, {})
    }
  }
})
