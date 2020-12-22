const GetNumber = require('../../../utils/get-number')
const Business = require('../../../models/business/business.model')
const Category = require('../../../models/category/category.model')
const { BadRequestError } = require('../../../utils/errors')

async function importBusinesses (businessesData) {
  let number = await GetNumber(Business)
  if (!businessesData) {
    throw BadRequestError('Data not found')
  }

  await Promise.all(businessesData.map(async businessData => {
    const businessDoc = await getBusinessDoc(businessData)
    if (businessData.number) {
      await Business.findByIdAndUpdate(businessDoc._id, businessDoc)
    } else {
      let inserted = false
      while (!inserted) {
        businessDoc.number = number++
        const bus = await Business.find({number: businessDoc.number})
        if (!bus) {
          await businessDoc.save()
          inserted = true
        } else {
          businessDoc.number = number++
        }
      }
    }
  }))
}

async function getBusinessDoc (data) {
  console.log(data.latLng)
  const business = new Business({
    name: data.name,
    category: data.category,
    starRating: data.starRating,
    owner: data.owner,
    phone: data.phone,
    email: data.email,
    latLng: data.latLng,
    website: data.website,
    address: data.address,
    description: data.description,
    productsAndServices: data.productsAndServices,
    productsAndServicesImages: data.productsAndServicesImages,
    specialities: data.specialities,
    languagesSpoken: data.languagesSpoken,
    openingHours: data.openingHours,
    paymentMethods: data.paymentMethods,
    team: data.team,
    thumbnailImage: data.thumbnailImage,
    bannerImage: data.bannerImage,
    images: data.images,
    featured: data.featured,
    active: data.active
  })

  if (data._id) {
    business._id = data._id
  }
  if (data.number) {
    business.number = data.number
    const bus = await Business.findOne({ number: business.number })
    if (bus) {
      business._id = bus._id
    }
  } else {
    business.number = await GetNumber(Business)
  }

  if (data.categoryNumber) {
    const category = await Category.findOne({ number: data.categoryNumber })
    if (category) {
      business.category = category._id
    }
  }
  console.log(business.latLng)

  return business
}

module.exports = importBusinesses
