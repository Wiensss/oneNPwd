const prefixUrl = 'https://6f6e-onen-pwd-1302122430.tcb.qcloud.la/mini/'

module.exports = Behavior({
  data: {
    avatar:
      prefixUrl +
      'spaceman.jpg?sign=f7a97e507f39d46b33a01f716b165d07&t=1589728144',
    _shareUrls: {
      light:
        prefixUrl +
        'share-light.png?sign=a56e6b123d1c8c9e868726812ffa09aa&t=1589739692',
      dark:
        prefixUrl +
        'share-dark.png?sign=97cf60fbeb0c6aa6bcfc0b9285e5fd9c&t=1589740981'
    },
    qrUrls: {
      light:
        prefixUrl +
        'QR-light.png?sign=d1a649b3d2e0c9580bdfd3faa995683c&t=1589809266',
      dark:
        prefixUrl +
        'QR-dark.png?sign=59706566e7bcf8134d4828237740ca46&t=1589809258'
    }
  }
})
