const storage = require('../../utils/storage.js')
const dateUtil = require('../../utils/date.js')
const mediaUtil = require('../../utils/media.js')
const util = require('../../utils/util.js')
const aiUtil = require('../../utils/ai.js')

Page({
  data: {
    diary: null,
    loading: true,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    displayMood: '',
    showAiPanel: false,
    aiModes: [],
    selectedMode: null,
    aiResult: null,
    isAnalyzing: false
  },

  onLoad(options) {
    this.diaryId = options.id
    this.autoOpenAi = options.autoOpenAi === 'true'
    this.loadDiary()
    this.initAiModes()
  },

  onUnload() {
    mediaUtil.stopVoice()
  },

  initAiModes() {
    const modes = aiUtil.getAiModes()
    this.setData({ aiModes: modes })
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

      if (this.autoOpenAi) {
        setTimeout(() => {
          this.setData({ showAiPanel: true })
        }, 500)
      }
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
  },

  toggleAiPanel() {
    this.setData({
      showAiPanel: !this.data.showAiPanel,
      aiResult: null,
      selectedMode: null
    })
  },

  selectAiMode(e) {
    const mode = e.currentTarget.dataset.mode
    this.setData({ selectedMode: mode })
  },

  async startAiAnalyze() {
    if (!this.data.selectedMode) {
      util.showToast('请先选择分析模式')
      return
    }

    if (!this.data.diary) {
      util.showToast('日记加载中，请稍后')
      return
    }

    this.setData({ isAnalyzing: true })

    try {
      const result = await aiUtil.analyzeDiary(this.data.diary, this.data.selectedMode.key)
      this.setData({
        aiResult: result,
        isAnalyzing: false
      })
    } catch (err) {
      console.error('AI分析失败', err)
      util.showToast('分析失败，请重试')
      this.setData({ isAnalyzing: false })
    }
  },

  closeAiPanel() {
    this.setData({
      showAiPanel: false,
      aiResult: null,
      selectedMode: null
    })
  },

  copyAiResult() {
    if (this.data.aiResult) {
      wx.setClipboardData({
        data: this.data.aiResult.analysis,
        success() {
          util.showToast('已复制到剪贴板', 'success')
        }
      })
    }
  }
})
