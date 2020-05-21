Component({
  properties: {
    color: {
      type: String,
      value: ''
    },
    bgColor: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    tag: {
      type: Object,
      value: {},
      observer: 'bindButton'
    },
    cloud: {
      type: Number,
      value: 0
    }
  },

  data: {
    buttons: [
      {
        data: 'Upload',
        icon: 'cloudup',
        color: 'var(--BG-2)',
        bgColor: 'var(--PINK)'
      },
      {
        data: 'Edit',
        icon: 'edit',
        color: 'var(--BG-2)',
        bgColor: 'var(--PINK)'
      },
      {
        data: 'Delete',
        icon: 'delete',
        color: 'var(--BG-2)',
        bgColor: 'var(--PINK)'
      }
    ]
  },

  methods: {
    bindButton(tag) {
      if (tag.name)
        this.setData({
          buttons: [
            {
              icon: 'cloudup',
              color: tag.color,
              bgColor: tag.bgColor
            },
            {
              icon: 'edit',
              color: tag.color,
              bgColor: tag.bgColor
            },
            {
              icon: 'delete',
              color: tag.color,
              bgColor: tag.bgColor
            }
          ]
        })
    },

    onTap({ detail }) {
      this.triggerEvent('click', detail, {})
    }
  }
})
