const express = require('express')
const cartController = require('../controllers/cart')

const router = express.Router();

// add to cart
router.post('/add', cartController.add )

// remove from cart
router.post('/remove', cartController.remove )

module.exports = router;