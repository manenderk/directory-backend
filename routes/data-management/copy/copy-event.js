const Event = require('../../../models/event/event.model')
const { NotFoundError } = require('../../../utils/errors')

async function copyEvent (eventId) {
  const event = await Event.findById(eventId)
  if (!event) {
    throw new NotFoundError()
  }
  const events = await Event.find()
  for (const eve of events) {
    eve.thumbnailImage = event.thumbnailImage
    eve.bannerImage = event.bannerImage
    eve.eventImages = event.eventImages
    eve.socialLinks = event.socialLinks
    eve.presentedBy = event.presentedBy
    eve.inAssociationWith = event.inAssociationWith
    eve.sponsors = event.sponsors
    eve.pricings = event.pricings
    eve.ticketsLocations = event.ticketsLocations
    eve.contacts = event.contacts

    await Event.findByIdAndUpdate(eve._id, eve)
  }
}

module.exports = copyEvent
