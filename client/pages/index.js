import {
  throttle,
  formatTime,
  matchIndex,
  decryptData,
  coverToObject,
  parseFromArray,
  stringifyFromArray
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
      state && this._parsePwdInfo()
    },
    isDrawer: function (state) {
      !state && this.setData({ isOpen: false })
    },
    isDetail: function (state) {
      !state && this.setData({ isQuestion: false })
    },
    isLogin: async function (state) {
      this.setData({
        userInfo: state ? await getUserInfo('userInfo') : null
      })

      state && this._fetchStoragePwd()

      console.log('[login state]: ', state)
      console.warn(state ? '已授权' : '未授权')
    }
  },

  data: {
    userInfo: null,
    drawerItem: [
      {
        title: '切换主题',
        icon: 'theme',
        state: 'Theme',
        event: 'stateBus',
        show: true
      },
      {
        title: '转发分享',
        icon: 'share',
        openType: 'share',
        show: true
      },
      {
        title: '赞赏支持',
        icon: 'heart',
        event: 'bindCola',
        show: true
      },
      {
        title: '关于我',
        icon: 'github',
        state: 'About',
        event: 'stateBus',
        show: true
      },
      {
        title: '清空数据',
        icon: 'clean',
        state: 'Clean',
        event: 'stateBus'
      },
      {
        title: '意见反馈',
        icon: 'lamp',
        openType: 'feedback'
      }
    ],
    actionTip: {
      upload: {
        title: '备份',
        state: 'Upload',
        content: '确定在云服务中备份该密码记录'
      },
      offUpload: {
        title: '取消备份',
        state: 'OffUpload',
        content: '确定取消备份该密码记录'
      },
      delete: {
        title: '删除',
        state: 'Delete',
        content: '确定删除该密码信息',
        tip: '将同时删除此记录的备份，若存在'
      },
      clean: {
        title: '清空',
        state: 'Clean',
        content: '确定清空所有数据',
        tip: '此操作不可撤销，请谨慎操作'
      }
    },
    themeSelect: [
      {
        type: 'light',
        icon: 'sun',
        name: '亮色模式'
      },
      {
        type: 'dark',
        icon: 'moon',
        name: '深色模式'
      }
    ],
    cleanSelect: [
      {
        type: 'local',
        name: '清空本地数据'
      },
      {
        type: 'cloud',
        name: '清空备份数据'
      },
      {
        type: 'all',
        name: '清空所有数据'
      }
    ]
  },

  methods: {
    async onLoad() {
      this.setData({
        _isInit: true,
        navBarHeight: $.store.navBarHeight + 'px'
      })

      if (!this.data.isLogin) (await checkScope()) && this.checkLogin()
    },

    async onShow() {
      if (this.data._isInit) {
        this.setData({ _isInit: false })
        return
      }

      !(await checkScope()) && this.setData({ isLogin: false })
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
      this._fetchStoragePwd()
    },

    onPullDownRefresh() {
      const { isLogin, pwdList } = this.data

      if (!isLogin) return

      try {
        this.setData({ isRefresh: true })

        this._fetchStoragePwd()

        if (!pwdList.length) tip({ msg: '暂无本地密码记录' })

        wx.stopPullDownRefresh()
      } catch (err) {
        tip({ msg: '未知错误，刷新失败' })
        console.log(err)
      } finally {
        this.setData({ isRefresh: false })
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

    selectBus({ currentTarget }) {
      const { state, type } = currentTarget.dataset

      this[`_handle${state}`](type)
    },

    actionBus({ currentTarget }) {
      const { state } = currentTarget.dataset

      this[`_${state}Pwd`]()
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

    bindClean(e) {
      console.log(e)
    },

    bindDetail({ currentTarget }) {
      const { isSafe, pwdList } = this.data
      const { token } = currentTarget.dataset

      let curItem = pwdList.find(item => item.token === token)

      this.setData({ curItem, isDetail: true })

      if (isSafe) this._parsePwdInfo()
      else this._checkSafe()
    },

    bindAction({ detail, currentTarget }) {
      const { data } = detail
      const { token } = currentTarget.dataset

      if (data === 'Edit') {
        this.toRegister('edit', token)
        return
      }

      this.setData({
        _token: token,
        [`is${data}`]: true
      })
    },

    toRegister: throttle(function (type = 'add', token = '') {
      wx.navigateTo({
        url: `/pages/register/register?_type=${type}&_token=${token}`,
        events: {
          registerDone: () => this._fetchStoragePwd()
        }
      })
    }),

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
        tip({ msg: '未知错误，登录失败' })
        console.log('[call cloud login fail]: ', err)
      } finally {
        this.hideLoading()
      }
    },

    async _checkSafe() {
      const { curItem } = this.data

      try {
        if (await checkFingerPrint()) {
          const matchRes = await startFingerPrint(curItem.token)

          if (matchRes === curItem.token) this.showSafe()
        } else this.setData({ isTip: true })
      } catch (err) {
        if (err === 'startSoterAuthentication:fail cancel') return

        this.setData({ isDetail: false })

        tip({ msg: '尝试调用设备指纹认证，未知错误，请重试' })
      }
    },

    async login({ detail, currentTarget }) {
      const { userInfo } = detail
      const { id } = currentTarget

      if (!userInfo) return

      if (this.data.isLogin) !id && this.toRegister()
      else this.checkLogin(!id)
    },

    async _UploadPwd() {
      const { _token, pwdList } = this.data

      this.showLoading()

      try {
        await wx.cloud.callFunction({
          name: 'users',
          data: {
            method: 'upload',
            options: coverToObject(pwdList, [_token])
          }
        })

        pwdList.forEach(item => {
          item.view = viewCache[item.token] || item.view
          if (item.token === _token) {
            item.cloud = true
            item.update = +new Date()
          }
        })

        this._saveStoragePwd(pwdList)
        wx.startPullDownRefresh()

        tip({ msg: '备份成功' })
      } catch (err) {
        tip({ msg: '未知错误，备份失败' })
        console.log('[call cloud upload fail]: ', err)
      } finally {
        this.hideLoading()
      }
    },

    async _OffUploadPwd() {
      const { _token, pwdList } = this.data

      this.showLoading()

      try {
        await wx.cloud.callFunction({
          name: 'users',
          data: {
            method: 'removeOne',
            token: _token
          }
        })

        pwdList.forEach(item => {
          item.view = viewCache[item.token] || item.view
          if (item.token === _token) {
            item.cloud = false
            item.update = +new Date()
          }
        })

        this._saveStoragePwd(pwdList)
        wx.startPullDownRefresh()

        tip({ msg: '取消备份成功' })
      } catch (err) {
        tip({ msg: '未知错误，备份失败' })
        console.log('[call cloud removeOne fail]: ', err)
      } finally {
        this.hideLoading()
      }
    },

    async _DeletePwd() {
      const { _token, pwdList } = this.data

      this.showLoading()

      try {
        const { index, cloud } = matchIndex(pwdList, _token)

        if (cloud)
          await wx.cloud.callFunction({
            name: 'users',
            data: {
              method: 'removeOne',
              token: _token
            }
          })

        if (index !== -1) pwdList.splice(index, 1)

        this._saveStoragePwd(pwdList)
        wx.startPullDownRefresh()

        tip({ msg: '删除成功' })
      } catch (err) {
        tip({ msg: '未知错误，删除失败' })
        console.log('[call cloud removeOne fail]', err)
      } finally {
        this.hideLoading()
      }
    },

    _handleTheme(type) {
      if (type === this.data.theme) return

      this.setData({ isDrawer: false })
      this.triggerTheme(type)
    },

    _handleClean(type) {
      // 清空数据，根据 type: local\cloud\all
      console.log(type)
    },

    // _CleanPwd() {
    //   console.log('tap')
    // },

    // _cloudDelete() {},

    // _getStoragePwd() {},

    // _setStoragePwd() {},

    _parsePwdInfo() {
      let { curItem } = this.data

      curItem = {
        ...curItem,
        ...decryptData(curItem)['code'],
        view: ++viewCache[curItem.token],
        update: formatTime(curItem.update)
      }

      delete curItem.code

      this.setData({ curItem })
    },

    _updatePwdView() {
      const { pwdList } = this.data

      pwdList.forEach(item => (item.view = viewCache[item.token] || item.view))

      this._saveStoragePwd(pwdList)
    },

    _fetchStoragePwd() {
      const pwdList = parseFromArray(wx.getStorageSync('pwdList'))

      pwdList.forEach(item => (viewCache[item.token] = item.view))

      this.setData({ pwdList })
    },

    _saveStoragePwd(pwdList = []) {
      wx.setStorageSync('pwdList', stringifyFromArray(pwdList))
    }
  }
})
