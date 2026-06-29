const dateUtil = require('../../utils/date.js')
const util = require('../../utils/util.js')

Component({
  properties: {
    diary: {
      type: Object,
      value: null
    }
  },

  data: {
    friendlyDate: '',
    displayMood: '',
    typeText: ''
  },

  observers: {
    'diary': function(diary) {
      if (diary) {
        this.setData({
          friendlyDate: dateUtil.getFriendlyDate(diary.createTime),
          displayMood: util.getMoodEmoji(diary.mood),
          typeText: this.getTypeText(diary.type)
        })
      }
    }
  },

  methods: {
    getTypeText(type) {
      const typeMap = {
        text: '文字',
        voice: '语音',
        image: '图片',
        video: '视频',
        mixed: '混合'
      }
      return typeMap[type] || '文字'
    },

    onCardTap() {
      this.triggerEvent('tap', { diary: this.properties.diary })
    },

    onPreviewImage(e) {
      const src = e.currentTarget.dataset.src
      this.triggerEvent('previewimage', { src, images: this.properties.diary.images })
    }
  }
})
