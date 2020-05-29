const express = require('express')
const router = express.Router()
const Menu = require('@models/restaurant/menu.model.js')

const config = require('@root/config')
const multerStorage = require('@root/utils/file-uploader')
const uploader = multerStorage(config.uploadDirectories.menu, 'thumbnail')

// GET ALL BUSINESS TYPES
router.get('/', async (req, res, next) => {
  try {
    const documents = await Menu.find()
    res.status(200).json(documents)
  } catch (e) {
    res.status(500).json(e)
  }
})

// GET SINGLE BUSINESS TYPE
router.get('/:id', async (req, res, next) => {
  try {
    const menu = await Menu.findById(req.params.id)
    if (menu) {
      res.status(200).json(menu)
    } else {
      res.sendStatus(401)
    }
  } catch (e) {
    res.status(500).json(e)
  }
})

// GET ALL FEATURED BUSINESS TYPES
router.get('/filter/featured', async (req, res, next) => {
  try {
    const menus = await Menu.find({
      featured: true
    })
    res.status(200).json(menus)
  } catch (e) {
    res.status(500).json(e)
  }
})

// ADD Business Type
router.post('/', uploader, async (req, res, next) => {
  try {
    const menu = new Menu({
      name: req.body.name,
      thumbnail: req.file ? config.uploadDirectories.menu + '/' + req.file.filename : null,
      parentMenuId: req.body.parentMenuId && req.body.parentMenuId !== 'null' ? req.body.parentMenuId : null,
      featured: req.body.featured,
      active: req.body.active
    })

    const result = await menu.save()

    res.status(201).json(result)
  } catch (e) {
    res.status(500).json(e)
  }
})

// UPDATE BUSINESS TYPE
router.put('/:id', uploader, async (req, res, next) => {
  try {
    const menu = new Menu({
      _id: req.params.id,
      name: req.body.name,
      thumbnail: req.file ? config.uploadDirectories.menu + '/' + req.file.filename : req.body.thumbnail,
      parentMenuId: req.body.parentMenuId && req.body.parentMenuId !== 'null' ? req.body.parentMenuId : null,
      featured: req.body.featured,
      active: req.body.active
    })
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      menu,
      { new: true }
    )
    res.status(200).json(updatedMenu)
  } catch (e) {
    res.status(500).json(e)
  }
})

// Clean up business types
router.delete('/all', async (req, res, next) => {
  try {
    await Menu.collection.drop()
    res.sendStatus(200)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
