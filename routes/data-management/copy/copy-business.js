const Business = require('../../../models/business/business.model')
const { NotFoundError } = require('../../../utils/errors')

module.exports = async function copyBusiness (businessId) {
  const business = await Business.findById(businessId)
  if (!business) {
    throw new NotFoundError()
  }
  const businesses = await Business.find()
  for (const b of businesses) {
    b.bannerImage = business.bannerImage
    b.description = business.description
    b.images = business.images
    b.languagesSpoken = business.languagesSpoken
    b.openingHours = business.openingHours
    b.owner = business.owner
    b.paymentMethods = business.paymentMethods
    b.phone = business.phone
    b.productsAndServices = business.productsAndServicesImages
    b.productsAndServicesImages = business.productsAndServicesImages
    b.specialities = business.specialities
    b.team = business.team
    b.thumbnailImage = business.thumbnailImage
    await Business.findByIdAndUpdate(b._id, b)
  }
}
