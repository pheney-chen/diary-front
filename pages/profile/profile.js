const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')

Page({
  data: {
    stats: {
      total: 0,
      thisMonth: 0,
      consecutiveDays: 0,
      types: {
        text: 0,
        voice: 0,
        image: 0,
        video: 0,
        mixed: 0
      }
    },
    theme: 'light',
    showAbout: false
  },

  onLoad() {
    const app = getApp()
    this.setData({
      theme: app.globalData.theme
    })
  },

  onShow() {
    this.loadStats()
  },

  loadStats() {
    const stats = storage.getDiaryStats()
    this.setData({ stats })
  },

  goToEdit() {
    wx.navigateTo({
      url: '/pages/diary-edit/diary-edit'
    })
  },

  async exportData() {
    const allDiaries = storage.getAllDiaries()
    const dataStr = JSON.stringify(allDiaries, null, 2)
    wx.setClipboardData({
      data: dataStr,
      success() {
        util.showToast('数据已复制到剪贴板', 'success')
      }
    })
  },

  async clearAllData() {
    const confirm = await util.showModal('提示', '确定要清除所有日记数据吗？此操作不可恢复。')
    if (!confirm) return

    wx.removeStorageSync('diary_list')
    util.showToast('已清除', 'success')
    this.loadStats()
  },

  toggleTheme() {
    const app = getApp()
    const newTheme = this.data.theme === 'light' ? 'dark' : 'light'
    app.setTheme(newTheme)
    this.setData({ theme: newTheme })
    util.showToast('主题已切换', 'success')
  },

  showAboutModal() {
    this.setData({ showAbout: true })
  },

  hideAboutModal() {
    this.setData({ showAbout: false })
  },

  stopPropagation() {
  },

  getTotalStats() {
    const { types } = this.data.stats
    return types.text + types.voice + types.image + types.video + types.mixed
  }
})
