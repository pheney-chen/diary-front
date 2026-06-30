const storage = require('../../utils/storage.js')
const dateUtil = require('../../utils/date.js')
const util = require('../../utils/util.js')
const themeUtil = require('../../utils/theme.js')

Page({
  data: {
    diaryList: [],
    loading: false,
    searchKeyword: '',
    showSearch: false,
    selectedTag: '',
    allTags: [],
    showFilterPanel: false,
    filter: {
      type: 'all',
      mood: 'all',
      tag: 'all',
      startDate: '',
      endDate: ''
    },
    typeOptions: [
      { key: 'all', name: '全部' },
      { key: 'text', name: '文字' },
      { key: 'voice', name: '语音' },
      { key: 'image', name: '图片' },
      { key: 'video', name: '视频' }
    ],
    moodList: util.getMoodList(),
    theme: 'light',
    stats: {
      total: 0,
      thisMonth: 0,
      consecutiveDays: 0
    }
  },

  onLoad() {
    this.loadStats()
    this.loadTags()
    themeUtil.setPageTheme(this)
  },

  onShow() {
    themeUtil.setPageTheme(this)
    this.loadDiaryList()
    this.loadStats()
    this.loadTags()
  },

  onPullDownRefresh() {
    this.loadDiaryList()
    this.loadStats()
    this.loadTags()
    wx.stopPullDownRefresh()
  },

  loadStats() {
    const stats = storage.getDiaryStats()
    this.setData({ stats })
  },

  loadTags() {
    const allTags = storage.getAllTags()
    this.setData({ allTags })
  },

  loadDiaryList() {
    this.setData({ loading: true })

    const f = this.data.filter
    const hasFilter = f.type !== 'all' || f.mood !== 'all' || f.tag !== 'all' || f.startDate || f.endDate

    let list
    if (this.data.searchKeyword || hasFilter) {
      list = storage.filterDiaries({
        keyword: this.data.searchKeyword,
        type: f.type,
        mood: f.mood,
        tag: f.tag,
        startDate: f.startDate,
        endDate: f.endDate
      })
    } else if (this.data.selectedTag) {
      list = storage.getDiariesByTag(this.data.selectedTag)
    } else {
      list = storage.getAllDiaries()
    }

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

  selectTag(e) {
    const tag = e.currentTarget.dataset.tag
    const newTag = this.data.selectedTag === tag ? '' : tag
    this.setData({ selectedTag: newTag })
    this.loadDiaryList()
  },

  clearTagFilter() {
    this.setData({ selectedTag: '' })
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
  },

  goToAiAnalyze(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/diary-detail/diary-detail?id=${id}&autoOpenAi=true`
    })
  },

  toggleFilterPanel() {
    this.setData({ showFilterPanel: !this.data.showFilterPanel })
  },

  closeFilterPanel() {
    this.setData({ showFilterPanel: false })
  },

  selectFilterType(e) {
    const type = e.currentTarget.dataset.key
    this.setData({ 'filter.type': type })
  },

  selectFilterMood(e) {
    const mood = e.currentTarget.dataset.key
    this.setData({ 'filter.mood': mood })
  },

  selectFilterTag(e) {
    const tag = e.currentTarget.dataset.tag
    this.setData({ 'filter.tag': tag })
  },

  onStartDateChange(e) {
    this.setData({ 'filter.startDate': e.detail.value })
  },

  onEndDateChange(e) {
    this.setData({ 'filter.endDate': e.detail.value })
  },

  clearFilters() {
    this.setData({
      filter: {
        type: 'all',
        mood: 'all',
        tag: 'all',
        startDate: '',
        endDate: ''
      }
    })
  },

  applyFilters() {
    this.setData({ showFilterPanel: false })
    this.loadDiaryList()
  }
})
