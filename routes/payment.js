const express = require('express')
const cartController = require('../controllers/payment')

const router = express.Router();

// payment success
router.post('/success', cartController.success )

module.exports = router;