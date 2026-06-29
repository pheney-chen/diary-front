const mediaUtil = require('../../utils/media.js')
const dateUtil = require('../../utils/date.js')

Component({
  properties: {
    src: {
      type: String,
      value: ''
    },
    duration: {
      type: Number,
      value: 0
    },
    title: {
      type: String,
      value: '语音日记'
    }
  },

  data: {
    isPlaying: false,
    currentTime: 0,
    durationText: '00:00',
    currentTimeText: '00:00',
    progress: 0
  },

  lifetimes: {
    detached() {
      this.stopPlay()
    }
  },

  observers: {
    'src': function(src) {
      if (src && this.data.duration > 0) {
        this.setData({
          durationText: dateUtil.formatDuration(this.data.duration)
        })
      }
    },
    'duration': function(duration) {
      if (duration > 0) {
        this.setData({
          durationText: dateUtil.formatDuration(duration)
        })
      }
    }
  },

  methods: {
    togglePlay() {
      if (!this.properties.src) return

      if (this.data.isPlaying) {
        this.pausePlay()
      } else {
        this.startPlay()
      }
    },

    startPlay() {
      const audio = mediaUtil.getAudioContext()
      audio.src = this.properties.src
      audio.play()

      audio.onTimeUpdate(() => {
        const currentTime = audio.currentTime
        const duration = audio.duration || this.properties.duration
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0

        this.setData({
          currentTime,
          currentTimeText: dateUtil.formatDuration(currentTime),
          progress
        })
      })

      audio.onEnded(() => {
        this.setData({
          isPlaying: false,
          currentTime: 0,
          currentTimeText: '00:00',
          progress: 0
        })
        this.triggerEvent('ended')
      })

      audio.onError((err) => {
        console.error('语音播放错误', err)
        this.setData({ isPlaying: false })
        this.triggerEvent('error', err)
      })

      this.setData({ isPlaying: true })
      this.triggerEvent('play')
    },

    pausePlay() {
      mediaUtil.pauseVoice()
      this.setData({ isPlaying: false })
      this.triggerEvent('pause')
    },

    stopPlay() {
      mediaUtil.stopVoice()
      this.setData({
        isPlaying: false,
        currentTime: 0,
        currentTimeText: '00:00',
        progress: 0
      })
    },

    onSliderChange(e) {
      const value = e.detail.value
      const duration = this.properties.duration
      const seekTime = (value / 100) * duration

      const audio = mediaUtil.getAudioContext()
      audio.seek(seekTime)

      this.setData({
        currentTime: seekTime,
        currentTimeText: dateUtil.formatDuration(seekTime),
        progress: value
      })
    }
  }
})
