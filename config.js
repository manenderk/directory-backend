const config = {
  projectRoot: __dirname,
  uploadDirectory: '/uploads',
  exportFilesDirectory: '/files',
  auth: {
    bcryptIterations: 10,
    issuer: 'TheDirectory',
    expiresIn: 8,
    secret: 'p7pQQ?EL}Ogp9|0pPy|Xtd$0pp{.5x'
  }
}

module.exports = config
