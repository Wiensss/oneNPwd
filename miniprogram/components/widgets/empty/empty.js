const $ = getApp()
const { EMPTY_RECORDS } = $.require('./constants/data')
const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],
  options: {
    addGlobalClass: true,
  },
  computed: {
    emptyTip() {
      return EMPTY_RECORDS
    },
  },
})
