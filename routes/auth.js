const express = require('express')
const authController = require('../controllers/auth')

const router = express.Router();

// register process
router.post('/register', authController.register )

// login process
router.post('/login', authController.login )

// logout process
router.get('/logout', function(request, response, next){

    request.session.destroy();
    response.redirect("/");

});

module.exports = router;