const GetNumber = require('../../../utils/get-number')
const News = require('../../../models/news/news.model')
const {
  BadRequestError
} = require('../../../utils/errors')

async function importNewss (newsData) {
  let number = await GetNumber(News)
  if (!newsData) {
    throw BadRequestError('Data not found')
  }

  await Promise.all(newsData.map(async newsData => {
    const newsDoc = await getNewsDoc(newsData)
    if (newsData.number) {
      await News.findByIdAndUpdate(newsDoc._id, newsDoc)
    } else {
      newsDoc.number = number++
      await newsDoc.save()
    }
  }))
}

async function getNewsDoc (data) {
  const news = new News({
    title: data.title,
    thumbnailImage: data.thumbnailImage,
    bannerImage: data.bannerImage,
    body: data.body,
    active: data.active,
    featured: data.featured,
    order: data.order
  })

  if (data._id) {
    news._id = data._id
  }
  if (data.number) {
    news.number = data.number
    const n = await News.findOne({
      number: news.number
    })
    if (n) {
      news._id = n._id
    }
  } else {
    news.number = await GetNumber(News)
  }

  return news
}

module.exports = importNewss
