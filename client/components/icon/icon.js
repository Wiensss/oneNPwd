Component({
  properties: {
    name: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: '#ff375f'
    },
    size: {
      type: String,
      value: '40rpx'
    }
  },

  methods: {
    onClick(e) {
      this.triggerEvent('click', e.detail, {})
    }
  }
})
