Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: 'showChange'
    },
    name: {
      type: String,
      value: ''
    },
    time: {
      type: String,
      value: '0'
    },
    bgColor: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    }
  },

  methods: {
    showChange(value) {
      this.showNotify(value)
    },

    showNotify(value) {
      if (value) {
        setTimeout(() => {
          this.setData({ show: false })
        }, 3400)
      }

      this.setData({ show: value })
    }
  }
})
