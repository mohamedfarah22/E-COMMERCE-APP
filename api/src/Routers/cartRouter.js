const express = require('express');
const router = express.Router();
const db = require('../queries/cartQueries.js')

//munt get all carts func on cart router
router.get('/all', db.getAllCarts)
router.get('/user-product-queries', db.getUserProductCart)
router.get('/cart-total', db.getCartTotal)
router.post('/', db.createCartItem)
router.get('/:user_id',db.getUserCart)
router.delete('/', db.deleteCartItem)
router.put('/', db.updateQuantityCartItem)

module.exports = router