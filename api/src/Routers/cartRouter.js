const express = require('express');
const router = express.Router();
const db = require('../queries/cartQueries.js')

//munt get all carts func on cart router
router.get('/', db.getAllCarts)
router.post('/', db.createCartItem)
router.get('/:user_id',db.getUserCart)
module.exports = router