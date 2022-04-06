const $ = getApp()
const { THEME_MODE } = $.require('./constants/global')

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    mode: {
      type: String,
      value: THEME_MODE.DARK,
    },
  },
  methods: {
    noop() {},
  },
})
