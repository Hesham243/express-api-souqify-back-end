const express = require('express')
const router = express.Router();
const verifyToken = require('../middleware/verify-token.js')
const Item = require('../models/item.js')

// ========== Public Routes ===========

// ========= Protected Routes =========
router.use(verifyToken)
router.post('/storeId', async(req, res) => {

})

module.exports = router;
