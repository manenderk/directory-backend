const multer = require('multer')
const fs = require('fs')

module.exports = (path, fieldName, type = null, maxSize = null) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const completePath = 'public' + path
      if (!fs.existsSync(completePath)) {
        fs.mkdirSync(completePath)
      }
      cb(null, completePath)
    },
    filename: (req, file, cb) => {
      const newFileName =
        Date.now() +
        file.originalname.toLowerCase().split(' ').join('-')
      cb(null, newFileName)
    }
  })

  if (!type || type === 'single') {
    return multer({ storage }).single(fieldName)
  } else {
    console.log('test1')
    return multer({ storage }).array(fieldName, maxSize)
  }
}
