const express = require('express');
const router = express.Router();
const db = require('../queries/productQueries')


//get all products
router.get('/', db.getProducts);

//get all categories
router.get('/categories', db.getAllCategories)


//get products by id

router.get('/:id', db.getProductById)


//get products by category

router.get('/', db.getProductsByCategory)

//create new product
router.post('/', db.createProduct)

//updated existing product
router.put('/:id', db.updateProduct)

//delete existing product
router.delete('/:id', db.deleteProduct)


module.exports = router;
