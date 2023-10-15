const express = require('express');
const router = express.Router();


//munt get all carts func on cart router
module.exports = (pool) => {
    router.get('/all', (req, res,next) => {
        pool.query('SELECT * FROM carts ORDER BY id ASC', (error, results) => {
            if(error){
                res.status(500).json({ error: "Internal server error" });
            }
            res.status(200).json(results.rows)
        })
    })
  
   

router.get('/user-product-queries', (req, res, next) => {
    const { user_id, product_id } = req.query;
    pool.query('SELECT * FROM carts WHERE user_id = $1 AND product_id = $2', [user_id, product_id], (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        }

        if (results && results.rows) {
            res.status(200).json(results.rows);
        } else {
            res.status(404).json({ message: 'No matching rows found' });
        }
    });
})
    router.post('/', (req, res, next) => {
        const { user_id, product_id, quantity} = req.body;
    

    pool.query('SELECT * FROM carts WHERE user_id = $1 AND product_id = $2', [user_id, product_id], (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        }else if (results.rows.length === 0) {
            // Cart item doesn't exist, insert a new one
            pool.query('INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [user_id, product_id, quantity], (error, insertResults) => {
                if (error) {
                    res.status(400).send(error);
                }
                res.status(200).json(insertResults.rows);
            });
        } else {
            // Cart item exists, update quantity
            const existingQuantity = results.rows[0].quantity;
            const newQuantity = existingQuantity + quantity;
            pool.query('UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [newQuantity, user_id, product_id], (error) => {
                if(error){
                    res.status(500).json({ error: "Internal server error" });
                }
                res.status(200).json({newQuantity: newQuantity});
            });
        }
    });
    })
    router.get('/:user_id', (req, res, next) => {
        const user_id = req.params.user_id

    pool.query('SELECT * FROM carts WHERE user_id = $1', [user_id], (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).send(results.rows)
    })
    })

router.delete('/', (req, res, next) => {
    const {user_id, product_id} = req.query
    pool.query('DELETE FROM carts WHERE user_id = $1 AND product_id = $2 RETURNING *', [user_id, product_id], (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(results.rows)
    })
})
router.put('/', (req, res, next) => {
   
    const { user_id, product_id, quantity } = req.query;

    // Parse quantity and product_id to integers
    const parsedQuantity = parseInt(quantity, 10);
    

    pool.query('UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *', [parsedQuantity, user_id, product_id], (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        }

        // Check if any rows were updated
        if (results.rows.length === 0) {
            
            res.status(404).json({ message: 'No matching cart item found.' });
        } else {
            
            res.status(200).json(results.rows);
        }
    });
});

router.get('/cart-total', (req, res, next) =>{
    const { user_id} = req.query;
    pool.query(
      'SELECT SUM(quantity * price) AS total_cost FROM carts JOIN products ON carts.product_id = products.id WHERE carts.user_id = $1',
      [user_id],
      (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        }else {
          const totalCost = results.rows[0].total_cost;
          res.status(200).json(results);
        }
      });
})



return router
}

