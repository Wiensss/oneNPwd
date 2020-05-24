const $ = getApp()

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: {
      type: Boolean,
      value: false
    },
    height: {
      type: String,
      value: ''
    },

    guide: {
      type: String,
      value: ''
    }
  },

  methods: {
    noop() {},

    onClick() {
      const { guide } = this.data

      this.triggerEvent(
        'click',
        { type: guide === 'tap' ? 'isFirstLogin' : 'isFirstAdd' },
        {}
      )
    }
  }
})
