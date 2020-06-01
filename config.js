const config = {
  uploadDirectories: {
    businessType: '/uploads/business-types',
    businessImage: '/uploads/business-image',
    menuCategories: '/uploads/menu-categories',
    menuItems: '/uploads/menu-items'
  },
  auth: {
    bcryptIterations: 10,
    issuer: 'TheDirectory',
    expiresIn: 8,
    secret: 'p7pQQ?EL}Ogp9|0pPy|Xtd$0pp{.5x'
  }
}

module.exports = config
