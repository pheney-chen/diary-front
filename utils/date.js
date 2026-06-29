function formatTime(timestamp, format = 'YYYY-MM-DD HH:mm') {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

function formatDate(timestamp) {
  return formatTime(timestamp, 'YYYY-MM-DD')
}

function formatDateTime(timestamp) {
  return formatTime(timestamp, 'YYYY-MM-DD HH:mm')
}

function getFriendlyDate(timestamp) {
  const now = new Date()
  const date = new Date(timestamp)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const diff = Math.floor((today - targetDay) / (1000 * 60 * 60 * 24))

  if (diff === 0) {
    return '今天 ' + formatTime(timestamp, 'HH:mm')
  } else if (diff === 1) {
    return '昨天 ' + formatTime(timestamp, 'HH:mm')
  } else if (diff === 2) {
    return '前天 ' + formatTime(timestamp, 'HH:mm')
  } else if (diff < 7) {
    return diff + '天前'
  } else if (diff < 30) {
    return Math.floor(diff / 7) + '周前'
  } else if (diff < 365) {
    return Math.floor(diff / 30) + '个月前'
  } else {
    return Math.floor(diff / 365) + '年前'
  }
}

function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

function getCalendarMatrix(year, month) {
  const days = getMonthDays(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const prevMonthDays = getMonthDays(year, month - 1)

  const matrix = []
  let week = []

  for (let i = firstDay - 1; i >= 0; i--) {
    week.push({
      day: prevMonthDays - i,
      currentMonth: false,
      date: formatDate(new Date(year, month - 1, prevMonthDays - i))
    })
  }

  for (let i = 1; i <= days; i++) {
    week.push({
      day: i,
      currentMonth: true,
      date: formatDate(new Date(year, month, i))
    })
    if (week.length === 7) {
      matrix.push(week)
      week = []
    }
  }

  if (week.length > 0) {
    const remaining = 7 - week.length
    for (let i = 1; i <= remaining; i++) {
      week.push({
        day: i,
        currentMonth: false,
        date: formatDate(new Date(year, month + 1, i))
      })
    }
    matrix.push(week)
  }

  return matrix
}

function getWeekDays(lang = 'zh') {
  if (lang === 'zh') {
    return ['日', '一', '二', '三', '四', '五', '六']
  }
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}

function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

module.exports = {
  formatTime,
  formatDate,
  formatDateTime,
  getFriendlyDate,
  getMonthDays,
  getFirstDayOfMonth,
  getCalendarMatrix,
  getWeekDays,
  formatDuration
}
