function getTheme() {
  const app = getApp()
  return app.globalData.theme || 'light'
}

function setPageTheme(page) {
  const theme = getTheme()
  page.setData({ theme })
  return theme
}

function applyNavigationBarTheme(theme) {
  if (theme === 'dark') {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2a2a2a'
    })
  } else {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    })
  }
}

function toggleTheme() {
  const app = getApp()
  const newTheme = app.globalData.theme === 'dark' ? 'light' : 'dark'
  app.setTheme(newTheme)
  return newTheme
}

module.exports = {
  getTheme,
  setPageTheme,
  applyNavigationBarTheme,
  toggleTheme
}
