const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database({ throwOnNotFound: false })
const collection = db.collection('users')
const $ = db.command.aggregate
const _ = db.command

/**
 * 新增用户记录
 *
 * @param {String} _id 微信唯一标识
 * @returns {String} _id
 */
const addOne = _id => {
  return collection.add({
    data: {
      _id,
      pwdList: [],
      update: db.serverDate()
    }
  })
}

/**
 * 查询用户记录
 *
 * @param {String} _openid 微信唯一标识
 * @returns {Array} data
 */
const getOne = _id => {
  return collection.where({ _id }).get()
}

/**
 * 搜索用户记录
 *
 * @param {String} _id
 * @returns {Number} total
 */
const searchOne = _id => {
  return collection.where({ _id }).count()
}

module.exports = {
  addOne,
  getOne,
  searchOne
}
