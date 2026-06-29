const storage = require('../../utils/storage.js')
const dateUtil = require('../../utils/date.js')
const util = require('../../utils/util.js')

Page({
  data: {
    diaryList: [],
    loading: false,
    searchKeyword: '',
    showSearch: false,
    stats: {
      total: 0,
      thisMonth: 0,
      consecutiveDays: 0
    }
  },

  onLoad() {
    this.loadStats()
  },

  onShow() {
    this.loadDiaryList()
    this.loadStats()
  },

  onPullDownRefresh() {
    this.loadDiaryList()
    this.loadStats()
    wx.stopPullDownRefresh()
  },

  loadStats() {
    const stats = storage.getDiaryStats()
    this.setData({ stats })
  },

  loadDiaryList() {
    this.setData({ loading: true })
    const list = this.data.searchKeyword
      ? storage.searchDiaries(this.data.searchKeyword)
      : storage.getAllDiaries()

    const formattedList = list.map(item => ({
      ...item,
      friendlyDate: dateUtil.getFriendlyDate(item.createTime),
      dateStr: dateUtil.formatDate(item.createTime),
      displayMood: util.getMoodEmoji(item.mood)
    }))

    this.setData({
      diaryList: formattedList,
      loading: false
    })
  },

  toggleSearch() {
    this.setData({
      showSearch: !this.data.showSearch,
      searchKeyword: ''
    })
    if (!this.data.showSearch) {
      this.loadDiaryList()
    }
  },

  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    this.loadDiaryList()
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
  },

  goToCalendar() {
    wx.switchTab({
      url: '/pages/calendar/calendar'
    })
  }
})
