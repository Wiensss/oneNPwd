import {
  throttle,
  formatTime,
  matchIndex,
  decryptData,
  coverToObject,
  parseFromArray,
  stringifyFromArray,
  coverToObjectArray
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
const prefix = 'cloud://onen-pwd.6f6e-onen-pwd-1302122430/mini/'
const themeBvr = require('../behaviors/theme')
const commonBvr = require('../behaviors/common')
const selectBvr = require('../behaviors/select')
const loadingBvr = require('../behaviors/loading')

Component({
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/
  },

  behaviors: [themeBvr, commonBvr, selectBvr, loadingBvr],

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

      if (state) {
        this._fetchStoragePwd()
        this._checkFirstState('isFirstLogin')
      }

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
        title: '云同步',
        icon: 'cloud',
        state: 'Cloud',
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
      cleanLocal: {
        title: '清空',
        state: 'CleanLocal',
        content: '确定清空所有本地数据',
        tip: '此操作不可撤销，请谨慎操作'
      },
      cleanCloud: {
        title: '清空',
        state: 'CleanCloud',
        content: '确定清空所有备份数据',
        tip: '此操作不可撤销，请谨慎操作'
      },
      cleanAll: {
        title: '清空',
        state: 'CleanAll',
        content: '确定清空所有数据',
        tip: '此操作不可撤销，请谨慎操作'
      },
      cloudUpload: {
        title: '备份',
        state: 'CloudUpload',
        content: '在云服务中备份所有密码记录'
      },
      cloudDownload: {
        title: '同步',
        state: 'CloudDownload',
        content: '从云服务中同步所有密码记录'
      }
    }
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
        path: '/pages/index',
        imageUrl: `${prefix}share-${theme}.png`,
        title: '🎈我在这儿记录密码，轻便易用，不再烦恼密码丢失❗❗'
      }
    },

    showSafe() {
      this.setData({ isSafe: true })
    },

    actionBus({ currentTarget }) {
      const { state } = currentTarget.dataset

      this[`_action${state}`]()
    },

    bindCola() {
      const { theme } = this.data

      wx.previewImage({ urls: [`${prefix}QR-${theme}.png`] })
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

    bindGuide({ detail }) {
      const { type } = detail

      this.setData({ [`${type}`]: false })
      wx.setStorageSync(type, false)
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
          registerDone: () => {
            this._fetchStoragePwd()
            this._checkFirstState('isFirstAdd')
          }
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
        if (err.indexOf('startSoterAuthentication:fail')) return

        this.setData({ isDetail: false })

        tip({ msg: '尝试调用设备指纹认证，未知错误，请重试' })
        console.log('[call checkSafe fail]: ', err)
      }
    },

    async login({ detail, currentTarget }) {
      const { userInfo } = detail
      const { id } = currentTarget

      if (!userInfo) return

      if (this.data.isLogin) !id && this.toRegister()
      else this.checkLogin(!id)
    },

    async _actionUpload() {
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

    async _actionOffUpload() {
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

    async _actionDelete() {
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

    async _actionCleanCloud() {
      const { pwdList } = this.data

      this.showLoading()

      try {
        await wx.cloud.callFunction({
          name: 'users',
          data: { method: 'removeAll' }
        })

        pwdList.forEach(item => {
          item.view = viewCache[item.token] || item.view
          if (item.cloud) item.cloud = false
        })

        this._saveStoragePwd(pwdList)

        tip({ msg: '清空所有备份数据成功' })

        wx.startPullDownRefresh()
      } catch (err) {
        tip({ msg: '未知错误，清空失败' })
        console.log(err)
      } finally {
        this.hideLoading()
      }
    },

    async _actionCleanAll() {
      this.showLoading()

      try {
        wx.removeStorageSync('pwdList')

        await wx.cloud.callFunction({
          name: 'users',
          data: { method: 'removeAll' }
        })

        tip({ msg: '清空所有数据成功' })

        this._fetchStoragePwd()
      } catch (err) {
        tip({ msg: '未知错误，清空失败' })
        console.log(err)
      } finally {
        this.hideLoading()
      }
    },

    async _actionCloudUpload() {
      const { pwdList } = this.data

      this.showLoading()

      try {
        await wx.cloud.callFunction({
          name: 'users',
          data: {
            method: 'upload',
            options: coverToObjectArray(pwdList)
          }
        })

        pwdList.forEach(item => {
          item.view = viewCache[item.token] || item.view
          item.cloud = true
          item.update = +new Date()
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

    async _actionCloudDownload() {
      const { pwdList } = this.data

      this.showLoading()

      try {
        let { result } = await wx.cloud.callFunction({
          name: 'users',
          data: { method: 'download' }
        })

        for (let [token, data] of Object.entries(result.data)) {
          if (!pwdList.some(item => item.token === token)) {
            data.view = 0
            data.cloud = true
            data.update = +new Date()
            data.tag = JSON.parse(data.tag)
            pwdList.push(data)
          }
        }

        this._saveStoragePwd(pwdList)
        wx.startPullDownRefresh()

        tip({ msg: '同步成功' })
      } catch (err) {
        tip({ msg: '未知错误，同步失败' })
        console.log('[call cloud download fail]: ', err)
      } finally {
        this.hideLoading()
      }
    },

    _actionCleanLocal() {
      this.showLoading()

      try {
        wx.removeStorageSync('pwdList')

        tip({ msg: '清空所有本地数据成功' })

        this._fetchStoragePwd()
      } catch (err) {
        tip({ msg: '未知错误，清空失败' })
        console.log(err)
      } finally {
        this.hideLoading()
      }
    },

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
    },

    _checkFirstState(type) {
      const res = wx.getStorageSync(`${type}`)

      this.setData({ [`${type}`]: res === '' ? true : res })
    }
  }
})
