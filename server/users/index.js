const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const model = require('./model')

exports.main = async event => {
  const { OPENID } = cloud.getWXContext()
  const { method, options, token } = event

  let res = null

  switch (method) {
    case 'login':
      if ((await model.searchDoc(OPENID))['total'])
        res = (await model.getDoc(OPENID))['data'][0]
      else res = await model.addDoc(OPENID)
      break
    case 'upload':
      res = await model.addField(OPENID, options)
      break
    case 'download':
      res = model.getField(OPENID)
      break
    case 'removeOne':
      res = model.deleteField(OPENID, token)
      break
    case 'removeAll':
      res = model.setDoc(OPENID)
      break
  }

  return res
}
