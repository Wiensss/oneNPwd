Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    noop() {},

    onHideMask() {
      this.triggerEvent('close', {}, {})
    }
  }
})
