const express = require('express');
const router = express.Router();



//get all products
module.exports = (pool) => {
router.get('/', (req, res, next) => {
  //put this in a function
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
      
    } 
  else {
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
router.get('/categories', (req, res, next) => {
  pool.query('SELECT DISTINCT category FROM products', (error, results) => {
    if(error){
        res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).send(results.rows)
})
})


//get products by id

router.get('/:id', (req, res, next) => {
    const id =  parseInt(req.params.id);
    pool.query('SELECT * FROM products WHERE id=$1', [id], (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        } else{
          if (results.rows.length === 0) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.status(200).json(results.rows);
        }
          
    }
  })

})




//create new product
router.post('/', (req, res, next) => {
  const {product_name, product_description, category, price, available_quantity, image_url} = req.body;

    pool.query('INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [product_name, product_description, category, price, available_quantity, image_url], (error, results) => {
       if(error){
        res.status(500).json({ error: "Internal server error" });
       } 

       res.status(201).json(results.rows[0])
    })

})

//updated existing product
router.put('/:id', (req, res, next) => {
  const id = parseInt(req.params.id)
  const {product_name, product_description, price, available_quantity} = req.body;

      pool.query(
          'UPDATE products SET product_name=$1, product_description=$2, price=$3, available_quantity=$4 WHERE id=$5 RETURNING *',
          [product_name, product_description, price, available_quantity, id],
          (error, results) => {
              if (error) {
                  console.error("Error updating product:", error);
                  res.status(500).json({ error: "Internal server error" });
              } else {
                  if (results.rows.length === 0) {
                      res.status(404).json({ error: "Product not found" });
                  } else {
                      res.status(200).json(results.rows[0]);
                  }
              }
          }
      );

})


//delete existing product
router.delete('/:id',(req, res, next) => {
  const id = parseInt(req.params.id)
    
  pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [id], (error, results) => {
      if(error){
          res.status(500).json({ error: "Internal server error" });
      }else {
        if (results.rows.length === 0) {
            res.status(404).json({ error: "Product not found" });
        } else {
          res.status(200).json({ message: `Product deleted with ID: ${id}` })
        }
    }

  })
})

return router
}


