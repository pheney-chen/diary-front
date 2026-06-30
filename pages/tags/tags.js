const storage = require('../../utils/storage.js')
const util = require('../../utils/util.js')
const themeUtil = require('../../utils/theme.js')

Page({
  data: {
    allTags: [],
    theme: 'light',
    showRenameDialog: false,
    renameTag: '',
    renameInput: ''
  },

  onLoad() {
    this.loadTags()
    themeUtil.setPageTheme(this)
  },

  onShow() {
    themeUtil.setPageTheme(this)
    this.loadTags()
  },

  loadTags() {
    const allTags = storage.getAllTags()
    this.setData({ allTags })
  },

  goToTagDiaries(e) {
    const tag = e.currentTarget.dataset.tag
    wx.setNavigationBarTitle({ title: `#${tag}` })
    wx.navigateTo({
      url: `/pages/tag-diaries/tag-diaries?tag=${tag}`
    })
  },

  showRenameDialog(e) {
    const tag = e.currentTarget.dataset.tag
    this.setData({
      showRenameDialog: true,
      renameTag: tag,
      renameInput: tag
    })
  },

  hideRenameDialog() {
    this.setData({ showRenameDialog: false })
  },

  onRenameInput(e) {
    this.setData({ renameInput: e.detail.value })
  },

  async confirmRename() {
    const newName = this.data.renameInput.trim()
    const oldName = this.data.renameTag

    if (!newName) {
      util.showToast('标签名不能为空')
      return
    }

    if (newName === oldName) {
      this.setData({ showRenameDialog: false })
      return
    }

    const allDiaries = storage.getAllDiaries()
    const hasTag = allDiaries.some(d => d.tags && d.tags.includes(newName))
    if (hasTag) {
      util.showToast('标签已存在')
      return
    }

    allDiaries.forEach(diary => {
      if (diary.tags && diary.tags.includes(oldName)) {
        diary.tags = diary.tags.map(t => t === oldName ? newName : t)
        storage.saveDiary(diary)
      }
    })

    util.showToast('重命名成功', 'success')
    this.setData({ showRenameDialog: false })
    this.loadTags()
  },

  async deleteTag(e) {
    const tag = e.currentTarget.dataset.tag
    const confirm = await util.showModal('提示', `确定要删除标签「${tag}」吗？\n删除后标签将从所有日记中移除，日记本身不会被删除。`)
    if (!confirm) return

    const allDiaries = storage.getAllDiaries()
    allDiaries.forEach(diary => {
      if (diary.tags && diary.tags.includes(tag)) {
        diary.tags = diary.tags.filter(t => t !== tag)
        storage.saveDiary(diary)
      }
    })

    util.showToast('删除成功', 'success')
    this.loadTags()
  },

  stopPropagation() {}
})
