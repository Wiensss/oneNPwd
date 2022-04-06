const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database({ throwOnNotFound: false })
const collection = db.collection('users')
const _ = db.command

/**
 * 创建用户文档
 *
 * @param {String} _id 微信唯一标识
 * @returns {Object} _id, errMsg
 */
const addDoc = _id => {
  return collection.add({
    data: { _id }
  })
}

/**
 * 查询用户文档
 *
 * @param {String} _id 微信唯一标识
 * @returns DocumentReference
 */
const getDoc = _id => {
  return collection.where({ _id }).get()
}

/**
 * 搜索用户文档
 *
 * @param {String} _id 微信唯一标识
 * @returns {Number} total
 */
const searchDoc = _id => {
  return collection.where({ _id }).count()
}

/**
 * 删除用户文档
 *
 * @param {String} _id 微信唯一标识
 * @returns
 */
const setDoc = _id => {
  return collection.doc(_id).set({
    data: { _flag: true }
  })
}

/**
 * 添加用户字段
 *
 * @param {String} _id 微信唯一标识
 * @param {Object} options 添加选项
 * @returns {Object} stats: { update: Number }
 */
const addField = (_id, options) => {
  return collection.doc(_id).update({
    data: { ...options }
  })
}

/**
 * 查询用户字段
 *
 * @param {String} _id 微信唯一标识
 * @param {String} [token] 查询选项
 * @returns {Array} data
 */
const getField = _id => {
  return collection.doc(_id).field({ _id: 0, _flag: 0 }).get()
}

/**
 * 删除用户字段
 *
 * @param {String} _id 微信唯一标识
 * @param {String} token 删除选项
 * @returns {Number}
 */
const deleteField = (_id, token) => {
  return collection.doc(_id).update({
    data: {
      [token]: _.remove()
    }
  })
}

module.exports = {
  addDoc,
  getDoc,
  setDoc,
  searchDoc,
  addField,
  getField,
  deleteField
}
