const themeBvr = require('../../behaviors/theme')

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [themeBvr],

  data: {
    article: [
      {
        title: '数据存储及安全',
        content: [
          '本小程序提供本地及云服务存储密码记录。',
          '采用本地环境离线存储【默认】，系统不会记录任何有关密码记录的隐私数据。',
          '采用云服务环境存储，系统存储的是已进行加密处理的密码记录。'
        ]
      },
      {
        title: '数据隐私',
        content: [
          '密码记录涉及到的隐私项包括：',
          '密码、手机号码、电子邮箱、密保问题',
          '均采用 AES 算法进行加密处理，其密钥由系统根据密码记录自动生成。'
        ],
        style: {
          1: 'text-italic private-text'
        }
      },
      {
        title: '授权信息',
        content: [
          '本小程序只需授权基本的用户信息，此项用于备份功能及指纹解锁功能。'
        ]
      },
      {
        title: '联系我',
        content: ['📩 邮箱：', 'Colasour.vince@gmail.com'],
        style: {
          0: 'block-inline',
          1: 'block-inline text-pink text-italic'
        }
      }
    ]
  },

  methods: {
    onShow() {
      this.diffTheme()
    }
  }
})
