module.exports = Behavior({
  data: {
    isLoading: false
  },

  methods: {
    showLoading() {
      this.setData({ isLoading: true })
    },

    hideLoading() {
      this.setData({ isLoading: false })
    }
  }
})
