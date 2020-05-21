const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const model = require('./model')

exports.main = async event => {
  const { OPENID } = cloud.getWXContext()
  const { method } = event

  let res = null

  switch (method) {
    case 'login':
      if ((await model.searchOne(OPENID))['total'])
        res = (await model.getOne(OPENID))['data'][0]
      else res = await model.addOne(OPENID)
      break
    case 'createUser':
      res = model.addOne()
      break
    case 'deleteUser':
      break
    case 'getUser':
      break
    case 'updateUser':
      break
    case 'insertOnePwdInfo':
      break
    case 'updatePwdInfo':
      break
    case 'getPwdInfoList':
      break
    case 'deletePwdInfo':
      break
    case 'removePwdInfo':
      break
  }

  return res
}
