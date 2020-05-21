module.exports = Behavior({
  data: {
    numMap: ['一', '二', '三']
  },

  methods: {
    noop() {},

    stateBus({ currentTarget }) {
      const { state } = currentTarget.dataset

      this.setData({
        [`is${state}`]: !this.data[`is${state}`]
      })
    }
  }
})
