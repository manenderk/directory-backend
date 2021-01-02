const News = require('../../../models/news/news.model')
const { NotFoundError } = require('../../../utils/errors')

async function copyNews (newsId) {
  const pNews = await News.findById(newsId)
  if (!pNews) {
    throw new NotFoundError()
  }
  const news = await News.find()
  for (const newsItem of news) {
    newsItem.bannerImage = pNews.bannerImage
    newsItem.thumbnailImage = pNews.thumbnailImage

    await News.findByIdAndUpdate(newsItem._id, newsItem)
  }
}

module.exports = copyNews
