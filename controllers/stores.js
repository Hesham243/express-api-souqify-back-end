const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const Store = require('../models/store')
const router = express.Router()

// ========== Public Routes ===========

// GET ALL THE STORES
router.get('/', async (req, res) => {
    try {
        const stores = await Store.find().populate('owner')
        res.status(200).json(stores)
    } catch(err) {
        res.status(500).json(err)
    }
})

// GET ONE STORE
router.get('/:storeId', async (req, res) => {
    try {
        const store = await Store.findById(req.params.storeId)
        res.status(200).json(store)
    } catch (err) {
        res.status(500).json(err)
    }
    
})
// ========= Protected Routes =========

router.use(verifyToken)

//  CEATE NEW STORE 
router.post('/', async (req, res) => {
    try {
        req.body.owner = req.user._id
        const store = await Store.create(req.body)
        store._doc.owner = req.user
        res.status(201).json(store)
    } catch (err) {
        res.status(500).json(err)
    }
})

//UPDATE A SINGLE STORE
router.put('/:storeId', async (req, res) => {
    try {
        const store = await Store.findById(req.params.storeId)
        if(!store.owner.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that")
        }
        const updatedStore = await Store.findByIdAndUpdate(
            req.params.storeId,
            req.body,
            { new: true }
        )
        updatedStore._doc.owner = req.user
        res.status(200).json(updatedStore)
    } catch (err) {
        res.status(500).json(err)
    }
})

//DELETE A STORE
router.delete('/:storeId', async (req, res) => {
    try {
        const store = await Store.findById(req.params.storeId)
        if(!store.owner.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that")
        }
        const deletedStore = await Store.findByIdAndDelete(req.params.storeId)
        res.status(200).json(deletedStore)
    } catch (err) {
        res.status(500).json(err)
    }
})



module.exports = router