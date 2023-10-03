
//get product by id

const getProductById = (pool) => (req, res) => {
    const id =  parseInt(req.params.id);
    pool.query('SELECT * FROM products WHERE id=$1', [id], (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(results.rows)
    })
}


//create new product
const createProduct = (pool) => (req, res) => {
    const {product_description, category, price, available_quantity, image_url} = req.query;

    pool.query('INSERT INTO products (product_description, category, price, available_quantity, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *', [product_description, category, price, available_quantity, image_url], (error, results) => {
       if(error){
        res.status(500).json({ error: "Internal server error" });
       } 

       res.status(201).send(`Product added with ID: ${results.rows[0].id}`)
    })

    
}

//update existing product (allowed functionality only for updated description, price and available_quantity)
const updateProduct = (pool) => (req, res) => {
    const id = parseInt(req.params.id)
    const {product_description, price, available_quantity} = req.query;

    pool.query(
        'UPDATE products SET product_description=$1, price=$2, available_quantity=$3 WHERE id=$4', [product_description, price, available_quantity, id], (error, results) => {
           if(error){
            res.status(500).json({ error: "Internal server error" });
           } 
           res.status(200).send(`Product modified with ID: ${id}`)
        }
    )

}
//delete existing product
const deleteProduct = (pool) => (req, res) => {
    const id = parseInt(req.params.id)
    
    pool.query('DELETE FROM products WHERE id=$1', [id], (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).send(`Product deleted with ID: ${id}`)
    })
}

//get unique categories from products

const getAllCategories = (pool) => (req, res) => {

    pool.query('SELECT DISTINCT category FROM products', (error, results) => {
        if(error){
            res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).send(results.rows)
    })

}
module.exports ={
    getProductById,
    createProduct, 
    updateProduct,
    deleteProduct, 
    getAllCategories
}