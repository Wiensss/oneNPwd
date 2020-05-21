Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    onlyConfirm: {
      type: Boolean,
      value: false
    },
    showCancel: {
      type: Boolean,
      value: false
    },
    closeMark: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    zIndex: {
      type: Number,
      value: 4
    }
  },

  methods: {
    noop() {},

    onHideMask() {
      if (this.data.closeMark) this.triggerEvent('close', {}, {})
    },

    onCancel() {
      this.triggerEvent('cancel', {}, {})
    },

    onConfirm() {
      this.triggerEvent('confirm', {}, {})
      this.triggerEvent('close', {}, {})
    }
  }
})
