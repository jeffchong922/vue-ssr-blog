const multer = require('multer'),
      path = require('path'),
      { getRandomStr } = require('../utils/tools')

const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '..', process.env.IMAGE_DIR))
  },
  filename (req, file, cb) {
    const [, ext] = file.mimetype.split('/')
    const strRandom = getRandomStr(10)
    const now = new Date().toISOString()
    const replaceDate = now.replace(/:/g, '-')
    const fileName = `${strRandom}${replaceDate}.${ext}`
    cb(null, fileName)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    return cb(null, true)
  }
  cb(null, false)
}

const fileUpload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10 /* 10MB */
  },
  fileFilter
})

module.exports = fileUpload