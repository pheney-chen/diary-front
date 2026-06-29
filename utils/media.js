let recorderManager = null
let innerAudioContext = null

function getRecorderManager() {
  if (!recorderManager) {
    recorderManager = wx.getRecorderManager()
  }
  return recorderManager
}

function getAudioContext() {
  if (!innerAudioContext) {
    innerAudioContext = wx.createInnerAudioContext()
  }
  return innerAudioContext
}

function startRecord(options = {}) {
  return new Promise((resolve, reject) => {
    const recorder = getRecorderManager()

    recorder.onStart(() => {
      console.log('录音开始')
    })

    recorder.onStop((res) => {
      console.log('录音结束', res)
      resolve({
        tempFilePath: res.tempFilePath,
        duration: res.duration / 1000,
        fileSize: res.fileSize
      })
    })

    recorder.onError((err) => {
      console.error('录音错误', err)
      reject(err)
    })

    recorder.start({
      duration: options.duration || 600000,
      sampleRate: options.sampleRate || 44100,
      numberOfChannels: options.numberOfChannels || 1,
      encodeBitRate: options.encodeBitRate || 192000,
      format: options.format || 'mp3',
      frameSize: options.frameSize || 50
    })
  })
}

function stopRecord() {
  const recorder = getRecorderManager()
  recorder.stop()
}

function pauseRecord() {
  const recorder = getRecorderManager()
  recorder.pause()
}

function resumeRecord() {
  const recorder = getRecorderManager()
  recorder.resume()
}

function playVoice(filePath, onEnded, onError) {
  const audio = getAudioContext()
  audio.src = filePath
  audio.play()

  audio.onEnded(() => {
    if (onEnded) onEnded()
  })

  audio.onError((err) => {
    console.error('播放错误', err)
    if (onError) onError(err)
  })

  return audio
}

function pauseVoice() {
  const audio = getAudioContext()
  audio.pause()
}

function stopVoice() {
  const audio = getAudioContext()
  audio.stop()
}

function seekVoice(position) {
  const audio = getAudioContext()
  audio.seek(position)
}

function chooseImages(count = 9, sourceType = ['album', 'camera']) {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: count,
      mediaType: ['image'],
      sourceType: sourceType,
      sizeType: ['original', 'compressed'],
      camera: 'back',
      success(res) {
        const images = res.tempFiles.map(file => ({
          tempFilePath: file.tempFilePath,
          size: file.size,
          width: file.width,
          height: file.height
        }))
        resolve(images)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

function previewImage(urls, current = 0) {
  wx.previewImage({
    current: urls[current],
    urls: urls
  })
}

function chooseVideo(sourceType = ['album', 'camera']) {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: sourceType,
      maxDuration: 60,
      camera: 'back',
      success(res) {
        const file = res.tempFiles[0]
        resolve({
          tempFilePath: file.tempFilePath,
          duration: file.duration,
          size: file.size,
          width: file.width,
          height: file.height,
          thumbTempFilePath: file.thumbTempFilePath
        })
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

function saveFile(tempFilePath) {
  return new Promise((resolve, reject) => {
    wx.saveFile({
      tempFilePath: tempFilePath,
      success(res) {
        resolve(res.savedFilePath)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

function getFileInfo(filePath) {
  return new Promise((resolve, reject) => {
    wx.getFileInfo({
      filePath: filePath,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

function removeFile(filePath) {
  return new Promise((resolve, reject) => {
    wx.removeSavedFile({
      filePath: filePath,
      success() {
        resolve()
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

module.exports = {
  getRecorderManager,
  getAudioContext,
  startRecord,
  stopRecord,
  pauseRecord,
  resumeRecord,
  playVoice,
  pauseVoice,
  stopVoice,
  seekVoice,
  chooseImages,
  previewImage,
  chooseVideo,
  saveFile,
  getFileInfo,
  removeFile
}
