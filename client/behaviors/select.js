module.exports = Behavior({
  data: {
    themeSelect: [
      {
        type: 'light',
        icon: 'sun',
        name: '亮色模式'
      },
      {
        type: 'dark',
        icon: 'moon',
        name: '深色模式'
      }
    ],
    cleanSelect: [
      {
        type: 'CleanLocal',
        name: '清空本地数据'
      },
      {
        type: 'CleanCloud',
        name: '清空备份数据'
      },
      {
        type: 'CleanAll',
        name: '清空所有数据'
      }
    ],
    cloudSelect: [
      {
        type: 'CloudUpload',
        icon: 'cloudup',
        name: '备份所有数据'
      },
      {
        type: 'CloudDownload',
        icon: 'clouddown',
        name: '同步所有数据'
      }
    ]
  },

  methods: {
    selectBus({ currentTarget }) {
      const { state, type } = currentTarget.dataset

      this[`_select${state}`](type)
    },

    _selectTheme(type) {
      if (type === this.data.theme) return

      this.setData({ isDrawer: false })
      this.triggerTheme(type)
    },

    _selectCloud(type) {
      this.setData({
        isCloud: false,
        isDrawer: false,
        [`is${type}`]: true
      })
    },

    _selectClean(type) {
      this.setData({
        isClean: false,
        isDrawer: false,
        [`is${type}`]: true
      })
    }
  }
})
