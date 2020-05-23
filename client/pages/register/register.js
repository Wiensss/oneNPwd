import { tip, checkScope } from '../../utils/promisify'
import {
  md5,
  throttle,
  debounce,
  decryptData,
  encryptData,
  matchStorage,
  filterEmptyArray
} from '../../utils/util'

const themeBvr = require('../../behaviors/theme')
const commonBvr = require('../../behaviors/common')
const loadingBvr = require('../../behaviors/loading')

Component({
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/
  },

  behaviors: [themeBvr, commonBvr, loadingBvr],

  properties: {
    _type: {
      type: String,
      value: 'add'
    },
    _token: {
      type: String,
      value: ''
    }
  },

  observers: {
    isOpen: function (flag) {
      if (!flag) this._resetOptional()
    },
    field: function () {
      if (this.data.fieldError) this.setData({ fieldError: false })
    },
    password: function () {
      if (this.data.pwdError) this.setData({ pwdError: false })
      else if (this.data.pwdEmptyError) this.setData({ pwdEmptyError: false })
    },
    'name, phone, email': function () {
      if (this.data.accountError) this.setData({ accountError: false })
      else if (this.data.accountEmptyError)
        this.setData({ accountEmptyError: false })
    }
  },

  data: {
    isMinus: true,
    mark: '',
    num: 0,
    account: 0,
    options: [],
    _pwdInfo: {},
    accountMap: [
      { key: 'name', value: '帐号名称' },
      { key: 'phone', value: '手机号码' },
      { key: 'email', value: '电子邮箱' }
    ]
  },

  methods: {
    onLoad() {
      if (this.data._type === 'edit') this._parsePwdInfo()
    },

    onShow() {
      this.diffTheme()
    },

    hideSelect() {
      this.setData({ isSelect: false })
    },

    bindNum({ currentTarget }) {
      const { field } = currentTarget.dataset
      let { num } = this.data

      num = field === 'plus' ? num + 1 : num - 1

      if (num >= 0 && num <= 3) {
        this._updateOptions(field)

        this.setData({
          num,
          isPlus: num === 3,
          isMinus: num === 0
        })
      }
    },

    bindAccount({ currentTarget }) {
      const { account, accountMap } = this.data
      const { index } = currentTarget.dataset

      if (account === index) return

      this.setData({
        account: index,
        animate: 'animate-fadein-left',
        [accountMap[account]['key']]: ''
      })

      setTimeout(() => {
        this.setData({ animate: '' })
      }, 500)
    },

    bindInput: debounce(function ({ detail, currentTarget }) {
      const { field } = currentTarget.dataset

      this.setData({ [`${field}`]: detail.value })
    }),

    bindOptionInput: debounce(function ({ detail, currentTarget }) {
      const { index, field } = currentTarget.dataset

      this.setData({
        [`options[${index}].${field}`]: detail.value
      })
    }),

    submit: throttle(async function () {
      if (!this._isValidate()) return

      if (!(await checkScope())) {
        tip({ msg: '请先完成授权' })
        wx.openSetting()
        return
      }

      const {
        _type,
        _token,
        mark,
        field,
        account,
        options,
        password,
        tag = {},
        view = 0,
        name = '',
        email = '',
        phone = '',
        cloud = false
      } = this.data

      const pwdData = {
        tag,
        view,
        cloud,
        account,
        token: _token,
        mark: mark.trim(),
        name: name.trim(),
        field: field.trim(),
        update: +new Date(),
        code: {
          email: email.trim(),
          phone: phone.trim(),
          password: password.trim(),
          options: filterEmptyArray(options, 'question', 'answer')
        }
      }

      if (_type === 'add') pwdData.token = md5(pwdData)

      this._savePwdInfo(pwdData)
    }),

    reset: throttle(function () {
      const {
        tag,
        mark,
        name,
        field,
        email,
        phone,
        account,
        options,
        password
      } = this.data._pwdInfo

      this.setData({
        isPlus: false,
        isMinus: true,
        isSelect: false,
        account,
        tag: tag || {},
        mark: mark || '',
        name: name || '',
        email: email || '',
        field: field || '',
        phone: phone || '',
        password: password || '',
        num: options.length || 0,
        options: JSON.parse(JSON.stringify(options)) || []
      })
    }),

    _resetOptional() {
      const { account, accountMap, _pwdInfo } = this.data
      const options = {
        phone: _pwdInfo['phone'] || '',
        email: _pwdInfo['email'] || ''
      }

      delete options[accountMap[account]['key']]

      this.setData({
        num: _pwdInfo['num'] || 0,
        tag: _pwdInfo['tag'] || {},
        mark: _pwdInfo['mark'] || '',
        ...options
      })
    },

    _updateOptions(field) {
      const { options } = this.data

      if (field === 'minus') options.pop()
      else
        options.push({
          question: '',
          answer: ''
        })

      this.setData({ options })
    },

    _isValidate() {
      const { name, email, field, phone, account, password } = this.data
      const pwdExp = /^[^ ]+$/
      const phoneExp = /^1\d{10}$/
      const emailExp = /^[\w\.]+@[\w]+(\.[\w]+)+$/

      let flag = ''

      if (!field) flag = 'fieldError'
      else if (
        (account === 0 && !name) ||
        (account === 1 && !phone) ||
        (account === 2 && !email)
      )
        flag = 'accountEmptyError'
      else if (
        (account === 1 && !phoneExp.test(phone)) ||
        (account === 2 && !emailExp.test(email))
      )
        flag = 'accountError'
      else if (!password) flag = 'pwdEmptyError'
      else if (!pwdExp.test(password)) flag = 'pwdError'

      if (flag) {
        this.setData({ [`${flag}`]: true })
        wx.pageScrollTo({ selector: `.${flag}` })
        return false
      }

      return true
    },

    _parsePwdInfo() {
      let _pwdInfo = matchStorage(this.data._token)

      _pwdInfo = {
        ..._pwdInfo,
        ...decryptData(_pwdInfo)['code']
      }

      delete _pwdInfo.code
      delete _pwdInfo.token

      this.setData({
        ..._pwdInfo,
        _pwdInfo,
        isOpen: true,
        num: _pwdInfo.options.length,
        options: JSON.parse(JSON.stringify(_pwdInfo.options))
      })
    },

    async _savePwdInfo(pwdData) {
      this.showLoading()

      try {
        pwdData.code = encryptData(pwdData)

        if (pwdData.cloud)
          await wx.cloud.callFunction({
            name: 'users',
            data: {
              method: 'upload',
              options: {
                [`${pwdData.token}`]: {
                  code: pwdData.code,
                  mark: pwdData.mark,
                  name: pwdData.name,
                  field: pwdData.field,
                  token: pwdData.token,
                  account: pwdData.account
                }
              }
            }
          })

        let pwdList = wx.getStorageSync('pwdList') || []

        if (this.data._type === 'add') pwdList.push(JSON.stringify(pwdData))
        else
          pwdList = pwdList.map(item => {
            return JSON.parse(item)['token'] === pwdData.token
              ? JSON.stringify(pwdData)
              : item
          })

        wx.setStorageSync('pwdList', pwdList)

        tip({ type: 'success', msg: '保存成功' })

        setTimeout(() => {
          this.getOpenerEventChannel().emit('registerDone')
          wx.navigateBack({ delta: 2 })
        }, 600)
      } catch (err) {
        tip({ msg: '未知错误, 请稍后重试！' })
        console.log('[call _savePwdInfo fail]: ', err)
      } finally {
        this.hideLoading()
      }
    }
  }
})
