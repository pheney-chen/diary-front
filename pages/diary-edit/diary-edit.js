const storage = require('../../utils/storage.js')
const mediaUtil = require('../../utils/media.js')
const util = require('../../utils/util.js')

const DIARY_TYPES = [
  { key: 'text', name: '文字', icon: '📝' },
  { key: 'voice', name: '语音', icon: '🎤' },
  { key: 'image', name: '图片', icon: '🖼️' },
  { key: 'video', name: '视频', icon: '🎬' }
]

Page({
  data: {
    id: '',
    title: '',
    content: '',
    currentType: 'text',
    typeOptions: DIARY_TYPES,
    images: [],
    video: '',
    videoThumb: '',
    voice: '',
    voiceDuration: 0,
    isRecording: false,
    recordTime: 0,
    tags: [],
    tagInput: '',
    showTagInput: false,
    mood: 'happy',
    moodList: util.getMoodList(),
    showMoodPicker: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id })
      this.loadDiary(options.id)
      wx.setNavigationBarTitle({ title: '编辑日记' })
    } else {
      wx.setNavigationBarTitle({ title: '新建日记' })
    }
  },

  onUnload() {
    if (this.data.isRecording) {
      this.stopRecording()
    }
    if (this.recordTimer) {
      clearInterval(this.recordTimer)
    }
  },

  loadDiary(id) {
    const diary = storage.getDiary(id)
    if (diary) {
      this.setData({
        title: diary.title || '',
        content: diary.content || '',
        currentType: diary.type || 'text',
        images: diary.images || [],
        video: diary.video || '',
        videoThumb: diary.videoThumb || '',
        voice: diary.voice || '',
        voiceDuration: diary.voiceDuration || 0,
        tags: diary.tags || [],
        mood: diary.mood || 'happy'
      })
    }
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  switchType(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ currentType: type })
  },

  async chooseImages() {
    try {
      const images = await mediaUtil.chooseImages(9 - this.data.images.length)
      const newImages = images.map(img => img.tempFilePath)
      this.setData({
        images: [...this.data.images, ...newImages]
      })
    } catch (err) {
      console.error('选择图片失败', err)
    }
  },

  removeImage(e) {
    const index = e.currentTarget.dataset.index
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.src
    mediaUtil.previewImage(this.data.images, this.data.images.indexOf(current))
  },

  async chooseVideo() {
    try {
      const video = await mediaUtil.chooseVideo()
      this.setData({
        video: video.tempFilePath,
        videoThumb: video.thumbTempFilePath
      })
    } catch (err) {
      console.error('选择视频失败', err)
    }
  },

  removeVideo() {
    this.setData({ video: '', videoThumb: '' })
  },

  async startRecording() {
    const hasPermission = await util.checkPermission('scope.record')
    if (!hasPermission) {
      const granted = await util.requestPermission('scope.record')
      if (!granted) {
        util.showToast('请先授权录音权限')
        return
      }
    }

    try {
      this.recordPromise = mediaUtil.startRecord({
        duration: 600000,
        format: 'mp3'
      })

      this.setData({
        isRecording: true,
        recordTime: 0
      })

      this.recordTimer = setInterval(() => {
        this.setData({
          recordTime: this.data.recordTime + 1
        })
      }, 1000)
    } catch (err) {
      console.error('录音失败', err)
      util.showToast('录音启动失败')
    }
  },

  async stopRecording() {
    if (this.recordTimer) {
      clearInterval(this.recordTimer)
      this.recordTimer = null
    }

    mediaUtil.stopRecord()

    try {
      const result = await this.recordPromise
      this.setData({
        isRecording: false,
        voice: result.tempFilePath,
        voiceDuration: Math.round(result.duration)
      })
    } catch (err) {
      console.error('录音结束失败', err)
      this.setData({ isRecording: false })
      util.showToast('录音失败')
    }
  },

  removeVoice() {
    this.setData({
      voice: '',
      voiceDuration: 0
    })
  },

  playVoice() {
    if (!this.data.voice) return
    mediaUtil.playVoice(this.data.voice, () => {
      console.log('播放结束')
    })
  },

  toggleMoodPicker() {
    this.setData({ showMoodPicker: !this.data.showMoodPicker })
  },

  selectMood(e) {
    const mood = e.currentTarget.dataset.mood
    this.setData({
      mood,
      showMoodPicker: false
    })
  },

  toggleTagInput() {
    this.setData({ showTagInput: !this.data.showTagInput })
  },

  onTagInput(e) {
    this.setData({ tagInput: e.detail.value })
  },

  addTag() {
    const tag = this.data.tagInput.trim()
    if (!tag) return
    if (this.data.tags.includes(tag)) {
      util.showToast('标签已存在')
      return
    }
    if (this.data.tags.length >= 5) {
      util.showToast('最多添加5个标签')
      return
    }
    this.setData({
      tags: [...this.data.tags, tag],
      tagInput: '',
      showTagInput: false
    })
  },

  removeTag(e) {
    const index = e.currentTarget.dataset.index
    const tags = [...this.data.tags]
    tags.splice(index, 1)
    this.setData({ tags })
  },

  async saveDiary() {
    const { title, content, images, video, voice, voiceDuration, tags, mood, id } = this.data

    if (!content.trim() && !voice && images.length === 0 && !video) {
      util.showToast('请至少输入一些内容')
      return
    }

    util.showLoading('保存中...')

    try {
      let finalImages = images
      let finalVoice = voice
      let finalVideo = video

      const diary = {
        id: id || '',
        title: title.trim(),
        content: content.trim(),
        type: this.determineType(),
        images: finalImages,
        video: finalVideo,
        videoThumb: this.data.videoThumb,
        voice: finalVoice,
        voiceDuration,
        tags,
        mood
      }

      const savedId = storage.saveDiary(diary)

      util.hideLoading()
      util.showToast('保存成功', 'success')

      setTimeout(() => {
        if (id) {
          wx.navigateBack()
        } else {
          wx.redirectTo({
            url: `/pages/diary-detail/diary-detail?id=${savedId}`
          })
        }
      }, 1500)
    } catch (err) {
      util.hideLoading()
      console.error('保存失败', err)
      util.showToast('保存失败')
    }
  },

  determineType() {
    const { content, voice, images, video } = this.data
    const hasText = !!content.trim()
    const hasVoice = !!voice
    const hasImage = images.length > 0
    const hasVideo = !!video

    const typeCount = [hasText, hasVoice, hasImage, hasVideo].filter(Boolean).length

    if (typeCount > 1) return 'mixed'
    if (hasText) return 'text'
    if (hasVoice) return 'voice'
    if (hasImage) return 'image'
    if (hasVideo) return 'video'
    return 'text'
  }
})
