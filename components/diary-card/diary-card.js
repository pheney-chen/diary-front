const util = require('../../utils/util.js')

Component({
  properties: {
    diary: {
      type: Object,
      value: {}
    }
  },

  data: {
    displayMood: ''
  },

  observers: {
    'diary': function(diary) {
      if (diary && diary.mood) {
        this.setData({
          displayMood: util.getMoodEmoji(diary.mood)
        })
      }
    }
  },

  methods: {
    onCardTap() {
      this.triggerEvent('tap', { id: this.data.diary.id })
    },

    onAiTap(e) {
      this.triggerEvent('ai', { id: this.data.diary.id })
    }
  }
})
