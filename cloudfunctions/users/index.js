const CONSTANTS = require('./constants')

const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const model = require('./model')

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { method, options, token } = event

  let res = null

  switch (method) {
    case CONSTANTS.CHECK_LOGIN:
      res = { isAuth: false, avatarUrl: '', nickName: '' }
      const { data } = await model.getDoc(OPENID)

      if (data.length) {
        const { isAuth = false, avatarUrl = '', nickName = '' } = data[0]
        res = { isAuth, avatarUrl, nickName }
      }
      break
    case CONSTANTS.LOGIN:
      if (!(await model.searchDoc(OPENID))['total']) await model.addDoc(OPENID)

      res = await model.addField(OPENID, options)
      break
    case CONSTANTS.GET_LIST:
      res = (await model.getDoc(OPENID))['data'][0]
      break
    case CONSTANTS.UPLOAD:
      res = await model.addField(OPENID, options)
      break
    case CONSTANTS.DOWNLOAD:
      res = model.getField(OPENID)
      break
    case CONSTANTS.REMOVE_ONE:
      res = model.deleteField(OPENID, token)
      break
    case CONSTANTS.REMOVE_ALL:
      res = model.setDoc(OPENID)
      break
  }

  return res
}
