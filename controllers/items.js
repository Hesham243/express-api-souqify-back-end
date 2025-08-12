const express = require('express')
const router = express.Router();
const verifyToken = require('../middleware/verify-token.js')
const Item = require('../models/item.js');
const { route } = require('./stores.js');

// ========== Public Routes ===========

// Get all items of a specific store
router.get('/', async(req, res) => {
  try {
    const items = await Item.find({store: req.params.storeId}).populate('owner').populate('store')
    res.status(200).json(items)

  }catch (error){
    res.status(401).json(error)
  }
})

// Get one item
router.get('/:itemId', async(req, res) => {
  try {
    const item = await Item.findById(req.params.itemId).populate('owner').populate('store')
    res.status(200).json(item)

  } catch (error){
    res.status(401).json(error)
  }
})




// ========= Protected Routes =========
router.use(verifyToken)

// Create new item for specific store
router.post('/', async(req, res) => {
  try {
    req.body.owner = req.user._id
    req.body.store = req.params.storeId
    
    const item = await Item.create(req.body)
    item._doc.owner = req.user
    res.status(201).json(item)

  }catch (error) {
    res.status(401).json(error)
  }
})

// Update an item from specific store
router.put('/:itemId', async(req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
    if (!item.owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that")
    }
    const updatedItem = await Item.findByIdAndUpdate(req.params.itemId, req.body, { new: true })
    updatedItem._doc.owner = req.user
    res.status(200).json(updatedItem)

  }catch (error) {
    res.status(401).json(error)
  }
})

// Delete an item from specific store
router.delete('/:itemId', async(req, res) => {
  try {
    const item = await Item.findById(req.params.itemId)
    if (!item.owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that")
    }
    const deletedItem = await Item.findByIdAndDelete(req.params.itemId)
    res.status(200).json(deletedItem)

  } catch (error) {
    res.status(401).json(error)
  }
})


module.exports = router;
