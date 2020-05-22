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
 * 解析 JSON 对象数组
 *
 * @param {Array} array 目标数组
 * @returns {Array} Object
 */
const parseJson = array => {
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
const stringifyArray = array => {
  if (!array instanceof Array) return []
  if (array.length < 1) return []

  return array.map(item => JSON.stringify(item))
}

/**
 * 根据 Token 匹配对象数组元素
 *
 * @param {Array} array 目标 JSON 数组
 * @param {String} token 匹配选项
 * @returns Object
 */
const matchToken = (array, token) => {
  if (!array instanceof Array) return []
  if (array.length < 1) return []

  return array.find(item => JSON.parse(item)['token'] === token)
}

/**
 * 更新对象数组
 *
 * @param {Array} array 目标 JSON 数组
 * @param {String} token 匹配条件
 * @param {Object} data 更新选项
 * @return {Array} String
 */
const updateArray = (array, token, data) => {
  if (!array instanceof Array) return []
  if (array.length < 1) return []

  return array.map(item => {
    return JSON.parse(item)['token'] === token
      ? JSON.stringify(data)
      : JSON.stringify(item)
  })
}

/**
 * 根据 KEY 查询对象数组下标及字段
 *
 * @param {Array} array 目标对象数组
 * @param {String} key 查询条件
 * @returns Object
 */
const findArrayIndex = (array, key) => {
  let index = array.findIndex(item => item.token === key)

  return {
    index,
    cloud: array[index]['cloud']
  }
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
  throttle,
  debounce,
  parseJson,
  formatTime,
  matchToken,
  decryptData,
  encryptData,
  updateArray,
  stringifyArray,
  findArrayIndex,
  filterEmptyArray
}
