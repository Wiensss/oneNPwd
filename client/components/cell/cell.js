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
      value: {}
    },
    cloud: {
      type: Boolean,
      value: false
    }
  },

  attached() {
    this.setData({
      buttons: [
        {
          data: this.data.cloud ? 'OffUpload' : 'Upload',
          icon: this.data.cloud ? 'cloudoff' : 'cloudup'
        },
        {
          data: 'Edit',
          icon: 'edit'
        },
        {
          data: 'Delete',
          icon: 'delete'
        }
      ]
    })
  },

  methods: {
    onTap({ detail }) {
      this.triggerEvent('click', detail, {})
    }
  }
})
