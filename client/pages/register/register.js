import { tip, checkScope } from '../../utils/promisify'
import {
  md5,
  throttle,
  debounce,
  matchToken,
  decryptData,
  encryptData,
  updateArray,
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
      if (flag) return

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
    num: 0,
    account: 0,
    _pwdInfo: {},
    options: [],
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
        tag,
        mark,
        name,
        view,
        cloud,
        field,
        email,
        phone,
        options,
        password
      } = this.data

      const pwdData = {
        tag: tag || {},
        view: view || 0,
        cloud: cloud || 0,
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

      this._savePwdInfo(pwdData)
    }),

    reset: throttle(function () {
      // this.setData({
      //   num: 0,
      //   mark: '',
      //   name: '',
      //   email: '',
      //   field: '',
      //   phone: '',
      //   password: '',
      //   options: [],
      //   isPlus: false,
      //   isMinus: true
      // })
    }),

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
      let _pwdInfo = matchToken(wx.getStorageSync('pwdList'), this.data._token)

      _pwdInfo = {
        ..._pwdInfo,
        ...decryptData(pwdInfo)
      }

      delete _pwdInfo.code

      console.log('[_pwdInfo]: ', _pwdInfo)

      this.setData({
        ..._pwdInfo,
        _pwdInfo,
        num: _pwdInfo.options.length
      })
    },

    _savePwdInfo(pwdData) {
      try {
        const { _type, _token } = this.data

        let pwdList = wx.getStorageSync('pwdList') || []

        pwdData.token = md5(pwdData)
        pwdData.code = encryptData(pwdData)

        if (_type === 'add') pwdList.push(JSON.stringify(pwdData))
        else pwdList = updateArray(pwdList, _token, pwdData)

        wx.setStorageSync('pwdList', pwdList)

        tip({ type: 'success', msg: '保存成功' })

        // setTimeout(() => {
        //   wx.navigateBack({ delta: 2 })
        //   this.getOpenerEventChannel().emit('registerDone')
        // }, 600)
      } catch (err) {
        tip({ msg: '未知错误, 请稍后重试！' })
        console.log('[call _savePwdInfo fail]: ', err)
      }
    }
  }
})
