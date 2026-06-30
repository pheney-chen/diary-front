const storage = require('../../utils/storage.js')
const dateUtil = require('../../utils/date.js')
const util = require('../../utils/util.js')
const themeUtil = require('../../utils/theme.js')

Page({
  data: {
    tag: '',
    diaryList: [],
    loading: false,
    theme: 'light'
  },

  onLoad(options) {
    this.setData({ tag: options.tag || '' })
    wx.setNavigationBarTitle({ title: `#${options.tag}` })
    this.loadDiaries()
    themeUtil.setPageTheme(this)
  },

  onShow() {
    themeUtil.setPageTheme(this)
    this.loadDiaries()
  },

  loadDiaries() {
    this.setData({ loading: true })
    const list = storage.getDiariesByTag(this.data.tag)

    const formattedList = list.map(item => ({
      ...item,
      friendlyDate: dateUtil.getFriendlyDate(item.createTime),
      displayMood: util.getMoodEmoji(item.mood)
    }))

    this.setData({
      diaryList: formattedList,
      loading: false
    })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/diary-detail/diary-detail?id=${id}`
    })
  },

  goToEdit() {
    wx.navigateTo({
      url: '/pages/diary-edit/diary-edit'
    })
  }
})
