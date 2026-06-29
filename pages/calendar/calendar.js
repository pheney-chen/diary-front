const storage = require('../../utils/storage.js')
const dateUtil = require('../../utils/date.js')

Page({
  data: {
    currentYear: 0,
    currentMonth: 0,
    today: '',
    calendarMatrix: [],
    weekDays: [],
    selectedDate: '',
    diaryDates: {},
    selectedDiaries: []
  },

  onLoad() {
    const now = new Date()
    const weekDays = dateUtil.getWeekDays()

    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth(),
      today: dateUtil.formatDate(now),
      selectedDate: dateUtil.formatDate(now),
      weekDays
    })

    this.generateCalendar()
    this.loadDiaryDates()
    this.loadSelectedDiaries()
  },

  onShow() {
    this.loadDiaryDates()
    this.loadSelectedDiaries()
  },

  generateCalendar() {
    const matrix = dateUtil.getCalendarMatrix(this.data.currentYear, this.data.currentMonth)
    this.setData({ calendarMatrix: matrix })
  },

  loadDiaryDates() {
    const diaries = storage.getDiariesByMonth(this.data.currentYear, this.data.currentMonth)
    const diaryDates = {}

    diaries.forEach(diary => {
      const dateStr = dateUtil.formatDate(new Date(diary.createTime))
      if (!diaryDates[dateStr]) {
        diaryDates[dateStr] = 0
      }
      diaryDates[dateStr]++
    })

    this.setData({ diaryDates })
  },

  loadSelectedDiaries() {
    const diaries = storage.getDiariesByDate(this.data.selectedDate)
    const formattedDiaries = diaries.map(item => ({
      ...item,
      friendlyDate: dateUtil.getFriendlyDate(item.createTime)
    }))
    this.setData({ selectedDiaries: formattedDiaries })
  },

  selectDate(e) {
    const date = e.currentTarget.dataset.date
    const currentMonth = e.currentTarget.dataset.currentmonth
    if (!currentMonth) return

    this.setData({
      selectedDate: date
    })
    this.loadSelectedDiaries()
  },

  prevMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth--
    if (currentMonth < 0) {
      currentMonth = 11
      currentYear--
    }
    this.setData({ currentYear, currentMonth })
    this.generateCalendar()
    this.loadDiaryDates()
  },

  nextMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth++
    if (currentMonth > 11) {
      currentMonth = 0
      currentYear++
    }
    this.setData({ currentYear, currentMonth })
    this.generateCalendar()
    this.loadDiaryDates()
  },

  goToToday() {
    const now = new Date()
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth(),
      selectedDate: dateUtil.formatDate(now)
    })
    this.generateCalendar()
    this.loadDiaryDates()
    this.loadSelectedDiaries()
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

  getMonthText() {
    return `${this.data.currentYear}年${this.data.currentMonth + 1}月`
  }
})
