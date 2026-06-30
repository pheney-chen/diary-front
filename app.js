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
    version: '1.1.0'
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
    this.applyTheme(theme)
  },

  setTheme(theme) {
    this.globalData.theme = theme
    wx.setStorageSync('theme', theme)
    this.applyTheme(theme)
  },

  applyTheme(theme) {
    if (theme === 'dark') {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#2a2a2a'
      })
      wx.setBackgroundColor({
        backgroundColor: '#1a1a1a'
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      })
      wx.setBackgroundColor({
        backgroundColor: '#f7f7f7'
      })
    }
  }
})
