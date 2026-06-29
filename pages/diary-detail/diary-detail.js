const storage = require('../../utils/storage.js')
const dateUtil = require('../../utils/date.js')
const mediaUtil = require('../../utils/media.js')
const util = require('../../utils/util.js')

Page({
  data: {
    diary: null,
    loading: true,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    displayMood: ''
  },

  onLoad(options) {
    this.diaryId = options.id
    this.loadDiary()
  },

  onUnload() {
    mediaUtil.stopVoice()
  },

  loadDiary() {
    const diary = storage.getDiary(this.diaryId)
    if (diary) {
      this.setData({
        diary: {
          ...diary,
          createTimeStr: dateUtil.formatDateTime(diary.createTime),
          updateTimeStr: dateUtil.formatDateTime(diary.updateTime)
        },
        loading: false,
        displayMood: util.getMoodEmoji(diary.mood),
        duration: diary.voiceDuration || 0
      })
    } else {
      util.showToast('日记不存在')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  togglePlay() {
    if (!this.data.diary || !this.data.diary.voice) return

    if (this.data.isPlaying) {
      mediaUtil.pauseVoice()
      this.setData({ isPlaying: false })
    } else {
      mediaUtil.playVoice(
        this.data.diary.voice,
        () => {
          this.setData({ isPlaying: false, currentTime: 0 })
        },
        (err) => {
          console.error('播放失败', err)
          util.showToast('播放失败')
          this.setData({ isPlaying: false })
        }
      )
      this.setData({ isPlaying: true })
    }
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.src
    const urls = this.data.diary.images
    mediaUtil.previewImage(urls, urls.indexOf(current))
  },

  playVideo() {
    const videoContext = wx.createVideoContext('diaryVideo')
    videoContext.play()
  },

  editDiary() {
    wx.navigateTo({
      url: `/pages/diary-edit/diary-edit?id=${this.diaryId}`
    })
  },

  async deleteDiary() {
    const confirm = await util.showModal('提示', '确定要删除这篇日记吗？')
    if (!confirm) return

    const success = storage.deleteDiary(this.diaryId)
    if (success) {
      util.showToast('删除成功', 'success')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } else {
      util.showToast('删除失败')
    }
  },

  onShareAppMessage() {
    return {
      title: this.data.diary ? this.data.diary.title : '我的日记',
      path: `/pages/diary-detail/diary-detail?id=${this.diaryId}`
    }
  }
})
