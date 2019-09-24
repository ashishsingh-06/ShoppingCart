const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../models/order');
const Product = require('../../models/product');
const checkAuth = require('../middleware/check-auth');

const orderControllers = require('../controllers/orders');

router.get('/',checkAuth,orderControllers.get_all_orders);

router.post('/',checkAuth,orderControllers.create_order);

router.get('/:orderId',checkAuth,orderControllers.get_single_order);

router.put('/:orderId',checkAuth,orderControllers.update_order);

router.delete('/:orderId',checkAuth,orderControllers.delete_order);

module.exports = router;
