module.exports = Behavior({
  data: {
    loading: false,
  },
  methods: {
    setLoading(value = false) {
      this.setData({
        loading: value,
      })
    },
  },
})
