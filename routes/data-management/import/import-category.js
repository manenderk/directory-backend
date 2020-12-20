const GetNumber = require('../../../utils/get-number')
const Category = require('../../../models/category/category.model')
const { BadRequestError } = require('../../../utils/errors')

async function importCategories (categoriesData) {
  let number = await GetNumber(Category)
  if (!categoriesData) {
    throw BadRequestError('Data not found')
  }

  await Promise.all(categoriesData.map(async categoryData => {
    const categoryDoc = await getCategoryDoc(categoryData)
    if (categoryData.number) {
      await Category.findByIdAndUpdate(categoryDoc._id, categoryDoc)
    } else {
      categoryDoc.number = number++
      await categoryDoc.save()
    }
  }))
}

async function getCategoryDoc (data) {
  const category = new Category({
    name: data.name,
    image: data.image,
    parentCategory: data.parentCategory,
    description: data.description,
    featured: data.featured,
    active: data.active,
    order: data.order
  })

  if (data._id) {
    category._id = data._id
  }
  if (data.number) {
    category.number = data.number
    const cat = await Category.findOne({ number: category.number })
    if (cat) {
      category._id = cat._id
    }
  } else {
    category.number = await GetNumber(Category)
  }

  console.log(category)
  return category
}

module.exports = importCategories
