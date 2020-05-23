Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },

  properties: {
    extClass: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: 'var(--BG-2)'
    },
    bgColor: {
      type: String,
      value: 'var(--PINK)'
    },
    buttons: {
      type: Array,
      value: [],
      observer: function observer(newVal) {
        this.addClassNameForButton()
      }
    },
    disable: {
      type: Boolean,
      value: false
    },
    icon: {
      type: Boolean,
      value: false
    },
    show: {
      type: Boolean,
      value: false
    },
    duration: {
      type: Number,
      value: 350
    },
    throttle: {
      type: Number,
      value: 40
    },
    rebounce: {
      type: Number,
      value: 0
    }
  },

  data: {
    size: null
  },

  ready() {
    this.updateRight()
    this.addClassNameForButton()
  },

  methods: {
    updateRight() {
      const { show, disable, throttle, rebounce } = this.data

      wx.createSelectorQuery()
        .in(this)
        .select('.left')
        .boundingClientRect(res => {
          const btnQuery = wx.createSelectorQuery().in(this)
          btnQuery
            .selectAll('.btn')
            .boundingClientRect(rects => {
              this.setData({
                size: {
                  buttons: rects,
                  button: res,
                  show,
                  disable,
                  throttle,
                  rebounce
                }
              })
            })
            .exec()
        })
        .exec()
    },

    addClassNameForButton() {
      const { buttons, icon } = this.data

      buttons.forEach(btn => {
        if (icon) btn.className = ''
        else
          btn.className =
            btn.type === 'warn'
              ? 'slideview_btn-group_warn'
              : 'slideview_btn-group_default'
      })

      this.setData({ buttons })
    },

    buttonTapByWxs(data) {
      this.triggerEvent('buttontap', data, {})
    },

    hide() {
      this.triggerEvent('hide', {}, {})
    },

    show() {
      this.triggerEvent('show', {}, {})
    },

    transitionEnd() {}
  }
})
