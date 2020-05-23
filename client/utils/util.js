import { mD5, encrypt, decrypt } from './private'

const moment = require('./moment')

/**
 * 生成 MD5 Token
 *
 * @param {Object} data 目标对象
 * @returns {String} String
 */
const md5 = data => {
  return mD5(data)
}

/**
 * 数据加密
 *
 * @param {Object} data 目标对象
 * @returns {String} String
 */
const encryptData = data => {
  return encrypt(data)
}

/**
 * 数据解密
 *
 * @param {String} data 目标字符串
 * @returns Object
 */
const decryptData = data => {
  return decrypt(data)
}

/**
 * 格式化时间
 *
 * @param {Number} timestamp 目标时间戳
 * @returns {String} String
 */
const formatTime = timestamp => {
  if (!timestamp || typeof timestamp !== 'number') return 0

  return moment(timestamp).format('YYYY/MM/DD HH:mm:ss')
}

/**
 * 函数节流
 *
 * @param {Function} fn 目标函数
 * @returns {Function} Function
 */
const throttle = fn => {
  let start = 0

  return function () {
    let end = +new Date()

    if (end - start > 800) {
      fn.apply(this, arguments)
      start = end
    }
  }
}

/**
 * 函数防抖
 *
 * @param {Function} fn 目标函数
 * @returns {Function} Function
 */
const debounce = fn => {
  let timer

  return function () {
    clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, 300)
  }
}

/**
 * 根据 TOKEN 获取所在对象数组下标
 *
 * @param {Array} pwdList 目标数组
 * @param {String} token 匹配选项
 * @returns index, cloud
 */
const matchIndex = (pwdList, token) => {
  let index = pwdList.findIndex(item => item.token === token)

  return {
    index,
    cloud: pwdList[index]['cloud'] || false
  }
}

/**
 * 根据 TOKEN 匹配 Stoage
 *
 * @param {String} token 匹配选项
 * @returns Object
 */
const matchStorage = token => {
  const pwdList = wx.getStorageSync('pwdList') || []

  return JSON.parse(pwdList.find(item => JSON.parse(item)['token'] === token))
}

/**
 * 根据 Token 封装对象
 *
 * @param {Array} array 目标数组
 * @param {String} token 匹配选项
 * @returns Object
 */
const coverToObject = (array, tokens) => {
  if (!array instanceof Array) return {}
  if (array.length < 1) return {}

  const res = {}

  array = array.filter(item => tokens.some(token => token === item.token))
  array.forEach(
    item =>
      (res[`${item.token}`] = {
        code: item.code,
        mark: item.mark,
        name: item.name,
        field: item.field,
        token: item.token,
        account: item.account,
        tag: JSON.stringify(item.tag)
      })
  )

  return res
}

/**
 * 封装对象数组
 *
 * @param {Array} array 目标数组
 * @returns token {}
 */
const coverToObjectArray = array => {
  if (!array instanceof Array) return {}
  if (array.length < 1) return {}

  const res = {}

  array.forEach(
    item =>
      (res[`${item.token}`] = {
        code: item.code,
        mark: item.mark,
        name: item.name,
        field: item.field,
        token: item.token,
        account: item.account,
        tag: JSON.stringify(item.tag)
      })
  )

  return res
}

/**
 * 解析对象数组
 *
 * @param {Array} array 目标数组
 * @returns {Array} Object
 */
const parseFromArray = array => {
  if (!array instanceof Array) return []
  if (array.length < 1) return []

  return array.map(item => JSON.parse(item))
}

/**
 * 序列化对象数组
 *
 * @param {Array} array 目标数组
 * @returns {Array} Object
 */
const stringifyFromArray = array => {
  if (!array instanceof Array) return []
  if (array.length < 1) return []

  return array.map(item => JSON.stringify(item))
}

/**
 * 过滤非空对象数组
 *
 * @param {Array} array 目标对象数组
 * @param {String} key1 过滤条件一
 * @param {String} key2 过滤条件二
 * @returns {Array} { key1, key2 }
 */
const filterEmptyArray = (array, key1, key2) => {
  if (!array instanceof Array) return []
  if (array.length < 1) return []

  array = array.filter(item => item[`${key1}`] && item[`${key2}`])

  return array.map(item => {
    return {
      [`${key1}`]: item[`${key1}`].trim(),
      [`${key2}`]: item[`${key2}`].trim()
    }
  })
}

export {
  md5,
  decryptData,
  encryptData,
  throttle,
  debounce,
  formatTime,
  matchIndex,
  matchStorage,
  coverToObject,
  coverToObjectArray,
  parseFromArray,
  stringifyFromArray,
  filterEmptyArray
}
