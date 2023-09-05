const express = require('express');
const router = express.Router();
const db = require('../queries/productQueries')


//get all products
router.get('/', (req, res, next) => {
    if (req.query.category) {
      // Handle getting products by category
      db.getProductsByCategory(req, res, next);
    } else {
      // Handle getting all products
      db.getProducts(req, res, next);
    }
  });
  

//get all categories
router.get('/categories', db.getAllCategories)


//get products by id

router.get('/:id', db.getProductById)


//get products by category


//create new product
router.post('/', db.createProduct)

//updated existing product
router.put('/:id', db.updateProduct)

//delete existing product
router.delete('/:id', db.deleteProduct)


module.exports = router;
