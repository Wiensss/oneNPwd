const $ = getApp()

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
    name: {
      type: String,
      value: ''
    }
  },

  data: {
    navBarHeight: $.store.navBarHeight + 'px',
    statusBarHeight: $.store.statusBarHeight + 'px'
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
