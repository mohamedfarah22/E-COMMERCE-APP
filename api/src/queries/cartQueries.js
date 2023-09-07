const Pool = require('pg').Pool;

const pool = new Pool({
    user:"admin",
    password: "ecommdb",
    host: "ecomm-database-postgres",
    database: "ecommercedatabase",
    port: 5432
});

const getAllCarts = (req, res) => {
    pool.query('SELECT * FROM carts ORDER BY id ASC', (error, results) => {
        if(error){
            throw(error)
        }
        res.status(200).json(results.rows)
    })
}
//createCart

//create a cart item
const createCartItem = (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    pool.query('SELECT * FROM carts WHERE user_id = $1 AND product_id = $2', [user_id, product_id], (error, results) => {
        if (error) {
            res.status(400).send(error);
        } else if (results.rows.length === 0) {
            // Cart item doesn't exist, insert a new one
            pool.query('INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [user_id, product_id, quantity], (error, insertResults) => {
                if (error) {
                    res.status(400).send(error);
                }
                res.status(201).send(`Cart item added with ID ${insertResults.rows[0].id}`);
            });
        } else {
            // Cart item exists, update quantity
            const existingQuantity = results.rows[0].quantity;
            const newQuantity = existingQuantity + quantity;
            pool.query('UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [newQuantity, user_id, product_id], (error) => {
                if (error) {
                    res.status(400).send(error);
                }
                res.status(200).send(`Cart item quantity updated`);
            });
        }
    });
};


const getUserCart = (req, res) => {
    const user_id = parseInt(req.params.user_id)

    pool.query('SELECT * FROM carts WHERE user_id = $1', [user_id], (error, results) => {
        if(error){
            res.status(400).send(error)
        }
        res.status(200).send(results.rows)
    })
}
module.exports ={
    getAllCarts, 
    createCartItem,
    getUserCart
}