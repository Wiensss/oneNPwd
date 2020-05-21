const tip = ({ msg, type = 'none', duration = 1500, mask = false }) => {
  wx.showToast({
    title: msg,
    icon: type,
    mask,
    duration
  })
}

const checkScope = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => resolve(res.authSetting['scope.userInfo']),
      fail: err => reject(err)
    })
  })
}

const getUserInfo = userInfo => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: res => resolve(res[userInfo]),
      fail: err => reject(err.errMsg)
    })
  })
}

const checkFingerPrint = () => {
  return new Promise(resolve => {
    wx.checkIsSoterEnrolledInDevice({
      checkAuthMode: 'fingerPrint',
      success: res => resolve(res.isEnrolled),
      fail: () => resolve(false)
    })
  })
}

const startFingerPrint = token => {
  return new Promise((resolve, reject) => {
    wx.startSoterAuthentication({
      requestAuthModes: ['fingerPrint'],
      challenge: token,
      authContent: '首次验证, 请用指纹解锁',
      success: res => resolve(JSON.parse(res.resultJSON)['raw']),
      fail: err => reject(err.errMsg)
    })
  })
}

export { tip, checkScope, getUserInfo, checkFingerPrint, startFingerPrint }
