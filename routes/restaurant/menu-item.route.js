const express = require('express')
const router = express.Router()
const MenuItem = require('@models/restaurant/menu-item.model')
const config = require('@root/config.js')
const uploader = require('@root/utils/file-uploader')(config.uploadDirectories.menuItems, 'thumbnail')

router.get('/menu-category-id/:menuCategoryId', async (req, res, next) => {
  try {
    const items = await MenuItem.find({
      menuCategoryId: req.params.menuCategoryId
    })
    res.status(200).json(items)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.post('/', uploader, async (req, res, next) => {
  try {
    const menuItem = new MenuItem({
      menuCategoryId: req.body.menuCategoryId,
      name: req.body.name,
      description: req.body.description,
      isVeg: req.body.isVeg,
      thumbnail: req.file ? config.uploadDirectories.menuItems + '/' + req.file.filename : null,
      price: req.body.price,
      active: req.body.active,
      featured: req.body.featured
    })

    const savedItem = await menuItem.save()
    res.status(201).json(savedItem)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.put('/:id', uploader, async (req, res, next) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id, {
        menuCategoryId: req.body.menuCategoryId,
        name: req.body.name,
        description: req.body.description,
        isVeg: req.body.isVeg,
        thumbnail: req.file ? config.uploadDirectories.menuItems + '/' + req.file.filename : req.body.thumbnail,
        price: req.body.price,
        active: req.body.active,
        featured: req.body.featured
      }, {
        new: true
      }
    )
    res.status(200).json(updatedItem)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
