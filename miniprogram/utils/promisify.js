const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => resolve(res.code),
      fail: (err) => reject(err.errMsg),
    })
  })
}

const getUserInfo = (userInfo) => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      withCredentials: true,
      success: (res) => resolve(res[userInfo]),
      fail: (err) => reject(err.errMsg),
    })
  })
}

const showToast = (
  { title, icon = 'error', duration = 1500, mask = true },
  error,
) => {
  if (error)
    console.error(error)

  return wx.showToast({
    title,
    icon,
    duration,
    mask,
  })
}

module.exports = {
  showToast,
  login,
  getUserInfo,
}
