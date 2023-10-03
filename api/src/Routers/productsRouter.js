const express = require('express');
const router = express.Router();
const db = require('../queries/productQueries')
const Pool = require('pg').Pool;

const pool = new Pool({
    user:"admin",
    password: "ecommdb",
    host: "ecomm-database-postgres",
    database: "ecommercedatabase",
    port: 5432
});


//get all products
router.get('/', (req, res, next) => {
    if (req.query.category) {
      // Handle getting products by category these functions work better within the router not sure why
      const category = req.query.category

      pool.query('SELECT * FROM products WHERE category= $1', [category], (error, results) => {
          if(error){
            res.status(500).json({ error: "Internal server error" });
  
          } else{
          res.status(200).json(results.rows)
          }
        })
      
    } else {
      // Handle getting all products these functions work better within the router not sure why
      pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
        if (error) {
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.status(200).json(results.rows);
        }
    });
      
    }
  });
  

//get all categories
router.get('/categories', db.getAllCategories(pool))


//get products by id

router.get('/:id', db.getProductById(pool))


//get products by category


//create new product
router.post('/', db.createProduct(pool))

//updated existing product
router.put('/:id', db.updateProduct(pool))

//delete existing product
router.delete('/:id', db.deleteProduct(pool))


module.exports = router;
