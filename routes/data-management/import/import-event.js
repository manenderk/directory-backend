const GetNumber = require('../../../utils/get-number')
const Event = require('../../../models/event/event.model')
const { BadRequestError } = require('../../../utils/errors')

async function importEvents (eventData) {
  let number = await GetNumber(Event)
  if (!eventData) {
    throw BadRequestError('Data not found')
  }

  await Promise.all(eventData.map(async eventData => {
    const eventDoc = await getEventDoc(eventData)
    if (eventData.number) {
      await Event.findByIdAndUpdate(eventDoc._id, eventDoc)
    } else {
      eventDoc.number = number++
      await eventDoc.save()
    }
  }))
}

async function getEventDoc (data) {
  const event = new Event({
    name: data.name,
    date: data.date,
    time: data.time,
    location: data.location,
    priceRange: data.priceRange,
    thumbnailImage: data.thumbnailImage,
    bannerImage: data.bannerImage,
    description: data.description,
    featured: data.featured,
    active: data.active,
    order: data.order,
    eventImages: data.eventImages,
    socialLinks: data.socialLinks,
    presentedBy: data.presentedBy,
    inAssociationWith: data.inAssociationWith,
    sponsors: data.sponsors,
    pricings: data.pricings,
    ticketsLocations: data.ticketsLocations,
    contacts: data.contacts,
    latLng: data.latLng
  })

  if (data._id) {
    event._id = data._id
  }
  if (data.number) {
    event.number = data.number
    const eve = await Event.findOne({ number: event.number })
    if (eve) {
      event._id = eve._id
    }
  } else {
    event.number = await GetNumber(Event)
  }

  return event
}

module.exports = importEvents
