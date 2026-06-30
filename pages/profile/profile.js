const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')
const themeUtil = require('../../utils/theme.js')

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
    themeUtil.setPageTheme(this)
  },

  onShow() {
    themeUtil.setPageTheme(this)
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

  goToTags() {
    wx.navigateTo({
      url: '/pages/tags/tags'
    })
  },

  async exportData() {
    const itemList = ['JSON 格式', 'Markdown 格式']
    const res = await new Promise((resolve) => {
      wx.showActionSheet({
        itemList,
        success: resolve,
        fail: () => resolve({ tapIndex: -1 })
      })
    })

    if (res.tapIndex === -1) return

    const allDiaries = storage.getAllDiaries()

    if (res.tapIndex === 0) {
      const dataStr = JSON.stringify(allDiaries, null, 2)
      wx.setClipboardData({
        data: dataStr,
        success() {
          util.showToast('JSON已复制到剪贴板', 'success')
        }
      })
    } else if (res.tapIndex === 1) {
      const mdStr = this.generateMarkdown(allDiaries)
      wx.setClipboardData({
        data: mdStr,
        success() {
          util.showToast('Markdown已复制到剪贴板', 'success')
        }
      })
    }
  },

  generateMarkdown(diaries) {
    if (!diaries || diaries.length === 0) return '# 我的日记本\n\n暂无日记内容\n'

    let md = '# 我的日记本\n\n'
    md += `> 共 ${diaries.length} 篇日记，导出时间：${new Date().toLocaleString()}\n\n---\n\n`

    diaries.forEach((diary, index) => {
      const dateStr = new Date(diary.createTime).toLocaleString()
      const mood = util.getMoodEmoji(diary.mood)
      md += `## ${diary.title || '无标题'}\n\n`
      md += `**日期**: ${dateStr}  **心情**: ${mood}\n\n`
      if (diary.tags && diary.tags.length > 0) {
        md += `**标签**: ${diary.tags.map(t => `#${t}`).join(' ')}\n\n`
      }
      if (diary.content) {
        md += `${diary.content}\n\n`
      }
      if (diary.voice) {
        md += `🎤 语音日记（时长 ${diary.voiceDuration || 0} 秒）\n\n`
      }
      if (diary.images && diary.images.length > 0) {
        md += `🖼️ 包含 ${diary.images.length} 张图片\n\n`
      }
      if (diary.video) {
        md += `🎬 包含视频日记\n\n`
      }
      if (index < diaries.length - 1) {
        md += '---\n\n'
      }
    })

    return md
  },

  async clearAllData() {
    const confirm = await util.showModal('提示', '确定要清除所有日记数据吗？此操作不可恢复。')
    if (!confirm) return

    wx.removeStorageSync('diary_list')
    util.showToast('已清除', 'success')
    this.loadStats()
  },

  toggleTheme() {
    const newTheme = themeUtil.toggleTheme()
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
