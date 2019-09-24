const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

// requiring User model
const User = require('../../models/user');
const userController = require('../controllers/user');

router.get('/',userController.get_users);

router.post('/signup',userController.user_signup);

router.post('/login',userController.user_login);

router.delete('/:userId',checkAuth,userController.delete_user);

module.exports = router;
