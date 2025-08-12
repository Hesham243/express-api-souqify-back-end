const express = require('express')
const router = express.Router({ mergeParams:true });
const verifyToken = require('../middleware/verify-token.js')
const Store = require('../models/store.js');

// ========== Public Routes ===========

// Get all items of a specific store
router.get('/', async(req, res) => {
  try {
    const store = await Store.findById(req.params.storeId)
    if (!store) return res.status(404).json({message: 'Store not found'})
    res.status(200).json(store.items)

  }catch (error){
    res.status(500).json(error)
  }
})

// Get one item
router.get('/:itemId', async(req, res) => {
  try {
    const store = await Store.findById(req.params.storeId)
    if(!store) return res.status(404).json({message: 'Store not found'})

    const item = store.items.id(req.params.itemId)
    if(!item) return res.status(404).json({message: 'Item not found'})
    
    res.status(200).json(item)

  } catch (error){
    res.status(500).json(error)
  }
})


// ========= Protected Routes =========
router.use(verifyToken)

// Create new item for specific store
router.post('/', async(req, res) => {
  try {
    console.log(req.params)
    const store = await Store.findById(req.params.storeId)
    if(!store) return res.status(404).json({message: 'Store not found'})
    if (!store.owner.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to add items to this store")
    }

    store.items.push(req.body)
    await store.save()

    const newItem = store.items[store.items.length - 1]
    res.status(201).json(newItem)

  }catch (error) {
    res.status(500).json(error)
  }
})

// Update an item from specific store
router.put('/:itemId', async(req, res) => {
  try {
    const store = await Store.findById(req.params.storeId)
    if(!store) return res.status(404).json({message: 'Store not found'})
    if (!store.owner.equals(req.user._id)) return res.status(403).send("You're not allowed to do that")

    const item = store.items.id(req.params.itemId)
    if (!item) return res.status(404).json({ message: 'Item not found' })

    Object.assign(item, req.body)
    await store.save()
    res.status(200).json(item)

  }catch (error) {
    res.status(500).json(error)
  }
})

// Delete an item from specific store
router.delete('/:itemId', async(req, res) => {
  try {
    const store = await Store.findById(req.params.storeId)
    if (!store) return res.status(404).json({ message: 'Store not found' })
    if (!store.owner.equals(req.user._id))  return res.status(403).send("You're not allowed to do that")

    const item = store.items.id(req.params.itemId)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    item.remove()
    await store.save()
    res.status(200).json(item)

  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = router;
