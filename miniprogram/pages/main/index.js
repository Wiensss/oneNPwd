const $ = getApp()
const { showToast } = $.require('./utils/promisify')
const { NOT_LOGIN, LOGIN_FIELD } = $.require('./constants/account')
const { USERS, LOGIN, CHECK_LOGIN, GET_LIST } = $.require('./constants/cloud')
const { FAIL_LOGIN, AUTH_LOGIN, SERVER_ERROR } = $.require('./constants/api')
const loadingBehavior = $.require('./behaviors/loading')

Component({
  behaviors: [loadingBehavior],
  data: {
    loading: false,
    userInfo: null,
  },
  methods: {
    async onLoad() {
      $.setGlobalData(LOGIN_FIELD, await this.checkLogin())

      if ($.globalData[LOGIN_FIELD]) {
        await this.fetchList()
      } else showToast({ title: AUTH_LOGIN, icon: 'none', mask: false })
    },
    async getUserInfo({ detail }) {
      this.setData({ userInfo: { ...detail } })
      await this.Login()
      await this.fetchList()
    },
    async checkLogin() {
      try {
        this.setData({ loading: true })

        const {
          result: { isAuth, avatarUrl, nickName },
        } = await wx.cloud.callFunction({
          name: USERS,
          data: { method: CHECK_LOGIN },
        })

        if (isAuth) this.setData({ userInfo: { avatarUrl, nickName } })

        return isAuth
      } catch ({ message }) {
        showToast({ title: SERVER_ERROR }, message)
      } finally {
        this.setData({ loading: false })
      }
    },
    async Login() {
      try {
        const { avatarUrl, nickName } = this.data.userInfo

        await wx.cloud.callFunction({
          name: USERS,
          data: {
            method: LOGIN,
            options: { avatarUrl, nickName, isAuth: true },
          },
        })
      } catch ({ message }) {
        showToast({ title: FAIL_LOGIN }, message)
      }
    },
    async fetchList() {
      try {
        this.setData({ loading: true })

        const { result } = await wx.cloud.callFunction({
          name: USERS,
          data: { method: GET_LIST },
        })
        console.log('result', result)
      } catch ({ message }) {
        showToast({ title: SERVER_ERROR }, message)
      } finally {
        this.setData({ loading: false })
      }
    },
  },
})
