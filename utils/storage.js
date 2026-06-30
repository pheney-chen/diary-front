const STORAGE_KEYS = {
  DIARY_LIST: 'diary_list',
  TAGS: 'diary_tags',
  THEME: 'theme',
  SETTINGS: 'settings'
}

function saveDiary(diary) {
  const list = getDiaryList()
  const index = list.findIndex(item => item.id === diary.id)
  if (index >= 0) {
    list[index] = {
      ...list[index],
      ...diary,
      updateTime: Date.now()
    }
  } else {
    list.unshift({
      ...diary,
      id: diary.id || generateId(),
      createTime: Date.now(),
      updateTime: Date.now()
    })
  }
  wx.setStorageSync(STORAGE_KEYS.DIARY_LIST, list)
  return diary.id || list[0].id
}

function getDiary(id) {
  const list = getDiaryList()
  return list.find(item => item.id === id) || null
}

function getDiaryList(page = 1, pageSize = 20) {
  const list = wx.getStorageSync(STORAGE_KEYS.DIARY_LIST) || []
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return list.slice(start, end)
}

function getAllDiaries() {
  return wx.getStorageSync(STORAGE_KEYS.DIARY_LIST) || []
}

function deleteDiary(id) {
  const list = getAllDiaries()
  const newList = list.filter(item => item.id !== id)
  wx.setStorageSync(STORAGE_KEYS.DIARY_LIST, newList)
  return newList.length !== list.length
}

function searchDiaries(keyword) {
  if (!keyword) return []
  const list = getAllDiaries()
  const lowerKeyword = keyword.toLowerCase()
  return list.filter(item => {
    return (
      (item.title && item.title.toLowerCase().includes(lowerKeyword)) ||
      (item.content && item.content.toLowerCase().includes(lowerKeyword)) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)))
    )
  })
}

function getDiariesByDate(dateStr) {
  const list = getAllDiaries()
  return list.filter(item => {
    const itemDate = formatDate(new Date(item.createTime))
    return itemDate === dateStr
  })
}

function filterDiaries(filters) {
  let list = getAllDiaries()

  if (filters.keyword) {
    const lowerKeyword = filters.keyword.toLowerCase()
    list = list.filter(item => {
      return (
        (item.title && item.title.toLowerCase().includes(lowerKeyword)) ||
        (item.content && item.content.toLowerCase().includes(lowerKeyword)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)))
      )
    })
  }

  if (filters.type && filters.type !== 'all') {
    const type = filters.type
    list = list.filter(item => {
      if (type === 'text') return !item.voice && (!item.images || item.images.length === 0) && !item.video
      if (type === 'voice') return !!item.voice
      if (type === 'image') return item.images && item.images.length > 0
      if (type === 'video') return !!item.video
      return true
    })
  }

  if (filters.mood && filters.mood !== 'all') {
    list = list.filter(item => item.mood === filters.mood)
  }

  if (filters.tag && filters.tag !== 'all') {
    list = list.filter(item => item.tags && item.tags.includes(filters.tag))
  }

  if (filters.startDate) {
    const startTime = new Date(filters.startDate).getTime()
    list = list.filter(item => new Date(item.createTime).getTime() >= startTime)
  }

  if (filters.endDate) {
    const endTime = new Date(filters.endDate).getTime() + 24 * 60 * 60 * 1000
    list = list.filter(item => new Date(item.createTime).getTime() < endTime)
  }

  return list
}

function getDiariesByMonth(year, month) {
  const list = getAllDiaries()
  return list.filter(item => {
    const date = new Date(item.createTime)
    return date.getFullYear() === year && date.getMonth() === month
  })
}

function getDiaryStats() {
  const list = getAllDiaries()
  const stats = {
    total: list.length,
    thisMonth: 0,
    consecutiveDays: 0,
    types: {
      text: 0,
      voice: 0,
      image: 0,
      video: 0,
      mixed: 0
    }
  }

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  list.forEach(item => {
    const date = new Date(item.createTime)
    if (date.getFullYear() === thisYear && date.getMonth() === thisMonth) {
      stats.thisMonth++
    }
    if (stats.types[item.type] !== undefined) {
      stats.types[item.type]++
    }
  })

  stats.consecutiveDays = calculateConsecutiveDays(list)

  return stats
}

function calculateConsecutiveDays(list) {
  if (list.length === 0) return 0

  const dateSet = new Set()
  list.forEach(item => {
    const date = new Date(item.createTime)
    dateSet.add(formatDate(date))
  })

  let count = 0
  const today = new Date()
  let currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  while (dateSet.has(formatDate(currentDate))) {
    count++
    currentDate.setDate(currentDate.getDate() - 1)
  }

  return count
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getAllTags() {
  const list = getAllDiaries()
  const tagMap = {}
  list.forEach(item => {
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach(tag => {
        if (tagMap[tag]) {
          tagMap[tag]++
        } else {
          tagMap[tag] = 1
        }
      })
    }
  })
  return Object.keys(tagMap).map(tag => ({
    name: tag,
    count: tagMap[tag]
  })).sort((a, b) => b.count - a.count)
}

function getDiariesByTag(tag) {
  const list = getAllDiaries()
  return list.filter(item => item.tags && item.tags.includes(tag))
}

module.exports = {
  STORAGE_KEYS,
  saveDiary,
  getDiary,
  getDiaryList,
  getAllDiaries,
  deleteDiary,
  searchDiaries,
  getDiariesByDate,
  getDiariesByMonth,
  getDiaryStats,
  generateId,
  getAllTags,
  getDiariesByTag,
  filterDiaries
}
