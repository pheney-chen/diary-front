const util = require('./util.js')

const AI_MODES = [
  { key: 'wang_yangming', name: '王阳明心学模式', icon: '📜', desc: '以知行合一、致良知的视角分析日记' },
  { key: 'mao_zedong', name: '毛泽东思想模式', icon: '🏛️', desc: '以实事求是、群众路线的视角分析' },
  { key: 'marxism', name: '马克思主义模式', icon: '⚒️', desc: '以唯物辩证法、历史唯物主义的视角分析' }
]

const AI_RESPONSES = {
  wang_yangming: [
    '从王阳明心学的角度来看，你的日记体现了"知行合一"的精神。每天的反思正是"致良知"的过程。',
    '你记录的内容展现了心学的核心要义——内心的觉察与行动的统一。继续修炼，保持这份觉知。',
    '从"心即理"的视角看，你的日记反映了对生活本质的深刻理解。知是行的开始，行是知的完成。',
    '你今天的记录体现了"事上磨练"的功夫。在日常中修行，在修行中生活，这正是心学的真谛。',
    '从致良知的角度分析，你的反思展现了对内心世界的深度探索。保持这份觉察，良知自会显现。'
  ],
  mao_zedong: [
    '从毛泽东思想的视角分析，你的日记体现了实事求是的精神。具体问题具体分析，这是马克思主义的活的灵魂。',
    '你今天的记录展现了实践出真知的道理。实践是检验真理的唯一标准，继续在生活中验证你的思考。',
    '从群众路线的角度来看，个人经历也是时代的一个缩影。你的日记记录了属于这个时代的真实声音。',
    '你的反思体现了矛盾分析法——在复杂的生活中找到主要矛盾，这正是解决问题的关键。',
    '从实事求是角度分析，你的记录展现了对客观现实的准确把握。理论联系实际，才能不断进步。'
  ],
  marxism: [
    '从马克思主义的角度分析，你的日记内容反映了社会存在与社会意识的关系。经济基础决定上层建筑，日常记录也是时代的印记。',
    '你今天的记录体现了唯物辩证法的思想——事物是不断发展变化的，要在矛盾中寻找平衡。',
    '从历史唯物主义的视角看，个人的生活点滴汇聚成历史的洪流。你的记录是时代的见证。',
    '你的反思展现了辩证思维——既看到困难，也看到希望；既分析问题，也寻求解决。这是马克思主义的方法论。',
    '从唯物辩证法的角度分析，你的日记体现了发展的观点和普遍联系的思想。继续深化这份思考。'
  ]
}

let conversationHistory = {}

function getAiModes() {
  return AI_MODES
}

function getModeInfo(modeKey) {
  return AI_MODES.find(mode => mode.key === modeKey) || null
}

async function analyzeDiary(diary, modeKey) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = AI_RESPONSES[modeKey] || AI_RESPONSES.wang_yangming
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const analysis = generateAnalysis(diary, modeKey, randomResponse)

      const mode = getModeInfo(modeKey)

      resolve({
        success: true,
        mode: mode,
        analysis: analysis,
        timestamp: Date.now()
      })
    }, 1500)
  })
}

function generateAnalysis(diary, modeKey, baseResponse) {
  let moodAnalysis = ''
  const moodMap = {
    happy: '开心愉悦',
    excited: '兴奋激动',
    calm: '平静祥和',
    sad: '有些低落',
    angry: '情绪激动',
    tired: '疲惫困倦',
    love: '充满爱意',
    surprised: '惊喜意外'
  }

  if (diary.mood && moodMap[diary.mood]) {
    moodAnalysis = `\n\n关于你的心情「${moodMap[diary.mood]}」：`
  }

  let contentAnalysis = ''
  if (diary.content && diary.content.length > 50) {
    const contentLength = diary.content.length
    if (contentLength > 500) {
      contentAnalysis = '\n\n你的日记内容较为丰富，展现了较强的自我反思能力。'
    } else if (contentLength > 200) {
      contentAnalysis = '\n\n你的记录简洁而有力，捕捉到了生活的关键瞬间。'
    }
  }

  let mediaAnalysis = ''
  const hasMedia = (diary.images && diary.images.length > 0) ||
                    diary.voice ||
                    diary.video
  if (hasMedia) {
    mediaAnalysis = '\n\n你选择了多媒体方式记录，这种多维度的表达有助于更完整地保存记忆。'
  }

  return baseResponse + moodAnalysis + contentAnalysis + mediaAnalysis
}

function addToHistory(diaryId, mode, analysis) {
  if (!conversationHistory[diaryId]) {
    conversationHistory[diaryId] = []
  }
  conversationHistory[diaryId].push({
    mode,
    analysis,
    timestamp: Date.now()
  })
}

function getHistory(diaryId) {
  return conversationHistory[diaryId] || []
}

function clearHistory(diaryId) {
  if (diaryId) {
    delete conversationHistory[diaryId]
  }
}

module.exports = {
  AI_MODES,
  getAiModes,
  getModeInfo,
  analyzeDiary,
  addToHistory,
  getHistory,
  clearHistory
}
