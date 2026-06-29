function generateId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

function throttle(fn, delay = 300) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  const cloned = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({
    title,
    icon,
    duration
  })
}

function showLoading(title = '加载中...', mask = true) {
  wx.showLoading({
    title,
    mask
  })
}

function hideLoading() {
  wx.hideLoading()
}

function showModal(title, content, options = {}) {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      confirmText: options.confirmText || '确定',
      cancelText: options.cancelText || '取消',
      confirmColor: options.confirmColor || '#4A90E2',
      success(res) {
        resolve(res.confirm)
      }
    })
  })
}

function showActionSheet(itemList) {
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList,
      success(res) {
        resolve(res.tapIndex)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

function getSystemInfo() {
  return new Promise((resolve) => {
    wx.getSystemInfo({
      success(res) {
        resolve(res)
      }
    })
  })
}

function copyText(text) {
  wx.setClipboardData({
    data: text,
    success() {
      showToast('复制成功', 'success')
    }
  })
}

function checkPermission(scope) {
  return new Promise((resolve) => {
    wx.getSetting({
      success(res) {
        resolve(!!res.authSetting[scope])
      }
    })
  })
}

function requestPermission(scope) {
  return new Promise((resolve) => {
    wx.authorize({
      scope,
      success() {
        resolve(true)
      },
      fail() {
        resolve(false)
      }
    })
  })
}

function openSetting() {
  return new Promise((resolve) => {
    wx.openSetting({
      success(res) {
        resolve(res.authSetting)
      }
    })
  })
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

function truncateText(text, maxLength, suffix = '...') {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + suffix
}

function getMoodEmoji(mood) {
  const moodMap = {
    happy: '😊',
    excited: '🤩',
    calm: '😌',
    sad: '😔',
    angry: '😠',
    tired: '😫',
    love: '🥰',
    surprised: '😮'
  }
  return moodMap[mood] || '😊'
}

function getMoodText(mood) {
  const moodMap = {
    happy: '开心',
    excited: '兴奋',
    calm: '平静',
    sad: '难过',
    angry: '生气',
    tired: '疲惫',
    love: '幸福',
    surprised: '惊喜'
  }
  return moodMap[mood] || '开心'
}

function getMoodList() {
  return [
    { key: 'happy', text: '开心', emoji: '😊' },
    { key: 'excited', text: '兴奋', emoji: '🤩' },
    { key: 'calm', text: '平静', emoji: '😌' },
    { key: 'sad', text: '难过', emoji: '😔' },
    { key: 'angry', text: '生气', emoji: '😠' },
    { key: 'tired', text: '疲惫', emoji: '😫' },
    { key: 'love', text: '幸福', emoji: '🥰' },
    { key: 'surprised', text: '惊喜', emoji: '😮' }
  ]
}

module.exports = {
  generateId,
  debounce,
  throttle,
  deepClone,
  showToast,
  showLoading,
  hideLoading,
  showModal,
  showActionSheet,
  getSystemInfo,
  copyText,
  checkPermission,
  requestPermission,
  openSetting,
  formatFileSize,
  truncateText,
  getMoodEmoji,
  getMoodText,
  getMoodList
}
