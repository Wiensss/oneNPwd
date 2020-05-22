import {
  throttle,
  parseJson,
  formatTime,
  decryptData,
  findArrayIndex,
  stringifyArray
} from '../utils/util'
import {
  tip,
  checkScope,
  getUserInfo,
  startFingerPrint,
  checkFingerPrint
} from '../utils/promisify'

const $ = getApp()
const viewCache = {}
const themeBvr = require('../behaviors/theme')
const commonBvr = require('../behaviors/common')
const configBvr = require('../behaviors/config')
const loadingBvr = require('../behaviors/loading')

Component({
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/
  },

  behaviors: [themeBvr, commonBvr, configBvr, loadingBvr],

  observers: {
    isSafe: function (state) {
      if (state) this._parsePwdInfo()
    },
    isLogin: async function (state) {
      this.setData({
        userInfo: state ? await getUserInfo('userInfo') : null,
        pwdList: state ? parseJson(wx.getStorageSync('pwdList')) : []
      })

      this.data.pwdList.forEach(item => (viewCache[item.token] = item.view))

      console.log('[login state]: ', state)
      console.warn(state ? '已授权' : '未授权')
    },
    isDetail: function (state) {
      if (state && !this.data.isSafe) this.checkSafe()
    }
  },

  data: {
    userInfo: null,
    themeType: [
      {
        type: 'light',
        name: '亮色模式'
      },
      {
        type: 'dark',
        name: '深色模式'
      }
    ],
    drawerItem: [
      {
        title: '切换主题',
        icon: 'theme',
        state: 'Theme',
        event: 'stateBus'
      },
      {
        title: '转发分享',
        icon: 'share',
        openType: 'share'
      },
      {
        title: '赞赏支持',
        icon: 'heart',
        event: 'bindCola'
      },
      {
        title: '意见反馈',
        icon: 'lamp',
        openType: 'feedback'
      },
      {
        title: '关于我',
        icon: 'github',
        state: 'About',
        event: 'stateBus'
      }
    ],
    actionTip: {
      upload: {
        title: '备份',
        state: 'Upload',
        content: '确定备份该密码记录'
      },
      delete: {
        title: '删除',
        state: 'Delete',
        content: '确定删除该密码信息',
        tip: '将同时删除此记录的备份，若存在'
      }
    }
  },

  methods: {
    async onLoad() {
      this.setData({
        _isInit: true,
        navBarHeight: $.store.navBarHeight + 'px'
      })

      if (!this.data.isLogin && (await checkScope())) this.checkLogin()
    },

    async onShow() {
      if (this.data._isInit) {
        this.setData({ _isInit: false })
        return
      }

      if (!(await checkScope())) this.setData({ isLogin: false })
    },

    onReady() {
      wx.createSelectorQuery()
        .select('#navBar')
        .boundingClientRect(rect => {
          this.setData({
            curBarHeight: Math.floor(rect.height) + 'px'
          })
        })
        .exec()
    },

    onHide() {
      this._updatePwdView()
    },

    onPullDownRefresh() {
      if (!this.data.isLogin) return

      this.showLoading()

      try {
        const pwdList = parseJson(wx.getStorageSync('pwdList'))

        if (!pwdList.length) tip({ msg: '暂无本地密码记录' })
        else this.setData({ pwdList })

        wx.stopPullDownRefresh()
      } catch (err) {
        tip({ msg: '未知错误，刷新失败！' })
        console.log(err)
      } finally {
        this.hideLoading()
      }
    },

    onShareAppMessage() {
      const { theme } = wx.getSystemInfoSync()

      return {
        path: '/pages/main/index',
        imageUrl: this.data._shareUrls[theme],
        title: '🎈我在这儿记录密码，轻便易用，不再烦恼密码丢失❗❗'
      }
    },

    showSafe() {
      this.setData({ isSafe: true })
    },

    bindCola() {
      const { qrUrls, theme } = this.data

      wx.previewImage({ urls: [qrUrls[theme]] })
    },

    bindCopy({ target, currentTarget }) {
      const { info } = target.dataset
      const { address } = currentTarget.dataset

      if (info || address)
        wx.setClipboardData({
          data: info || address,
          success: () => tip({ msg: '已复制 ' + (info ? info : '') })
        })
    },

    bindTheme({ currentTarget }) {
      const { type } = currentTarget.dataset

      if (type === this.data.theme) return

      this.setData({ isDrawer: false })
      this.triggerTheme(type)
    },

    bindDetail({ currentTarget }) {
      const { isSafe, pwdList } = this.data
      const { token } = currentTarget.dataset

      let curItem = pwdList.find(item => item.token === token)

      this.setData({ curItem, isDetail: true })

      if (isSafe) this._parsePwdInfo()
    },

    bindAction({ detail, currentTarget }) {
      const { index, data } = detail
      const { token } = currentTarget.dataset

      if (index === 1) {
        this._EditPwd(token)
        return
      }

      this.setData({
        _token: token,
        [`is${data}`]: true
      })
    },

    handeAction({ currentTarget }) {
      const { state } = currentTarget.dataset

      this[`_${state}Pwd`]()
    },

    async checkLogin(register = false) {
      this.showLoading()

      try {
        const { result } = await wx.cloud.callFunction({
          name: 'users',
          data: { method: 'login' }
        })

        if (!result._id) throw new Error()

        this.setData({
          isLogin: true,
          lastTime: formatTime(wx.getStorageSync('lastTime'))
        })

        wx.setStorage({ key: 'lastTime', data: +new Date() })

        if (register) this.toRegister()
      } catch (err) {
        tip({ msg: '未知错误，登录失败！' })
        console.log(err)
      } finally {
        this.hideLoading()
      }
    },

    async checkSafe() {
      const { curItem } = this.data

      try {
        if (await checkFingerPrint()) {
          const matchRes = await startFingerPrint(curItem.token)

          if (matchRes === curItem.token) this.setData({ isSafe: true })
        } else this.setData({ isTip: true })
      } catch (err) {
        if (err === 'startSoterAuthentication:fail cancel') return

        this.setData({ isDetail: false })

        tip({ msg: '尝试调用设备指纹认证，未知错误，请重试！' })
      }
    },

    async login({ detail, currentTarget }) {
      const { userInfo } = detail
      const { id } = currentTarget

      if (!userInfo) return

      if (this.data.isLogin && !id) this.toRegister()
      else this.checkLogin(!id)
    },

    toRegister: throttle(function (type = 'add', token = '') {
      wx.navigateTo({
        url: `/pages/register/register?_type=${type}&_token=${token}`,
        events: {
          registerDone: () => {
            wx.startPullDownRefresh()
          }
        }
      })
    }),

    _parsePwdInfo() {
      let { curItem } = this.data

      curItem = decryptData(curItem)

      curItem = {
        ...curItem,
        ...curItem.code,
        view: ++viewCache[curItem.token],
        cloud: formatTime(curItem.cloud),
        update: formatTime(curItem.update)
      }

      delete curItem['code']

      this.setData({ curItem })
    },

    _updatePwdView() {
      const { pwdList } = this.data

      pwdList.forEach(item => (item.view = viewCache[item.token] || item.view))

      wx.setStorageSync('pwdList', stringifyArray(pwdList))
    },

    _EditPwd() {
      const { _token } = this.data
      console.log('[edit pwd]: ', _token)
    },

    _DeletePwd() {
      const { _token, pwdList } = this.data
      const { index, cloud } = findArrayIndex(pwdList, _token)

      if (index !== -1) {
        this.showLoading()
        try {
          pwdList.splice(index, 1)

          this.setData({ pwdList })

          if (cloud) this._cloudDelete()
        } catch (err) {
          tip({ msg: '未知错误，删除失败！' })
        } finally {
          this.hideLoading()
        }
      } else tip({ msg: '删除失败，请稍后重试！' })
    },

    _UploadPwd() {
      const { _token } = this.data
      // 检查是否在数据库已有记录
      // 有，直接调用上传
      // 无，创建用户记录，返回
      console.log('[upload pwd]: ', _token)
    },

    _cloudDelete() {}
  }
})
