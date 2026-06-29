App({
  onLaunch() {
    this.checkStorageSize()
    this.initTheme()
  },

  onShow() {},

  onHide() {},

  onError(msg) {
    console.error('小程序错误：', msg)
  },

  globalData: {
    userInfo: null,
    theme: 'light',
    version: '1.0.0'
  },

  checkStorageSize() {
    wx.getStorageInfo({
      success(res) {
        console.log('当前存储大小：', res.currentSize, 'KB')
        console.log('存储限制大小：', res.limitSize, 'KB')
      }
    })
  },

  initTheme() {
    const theme = wx.getStorageSync('theme') || 'light'
    this.globalData.theme = theme
  },

  setTheme(theme) {
    this.globalData.theme = theme
    wx.setStorageSync('theme', theme)
  }
})
