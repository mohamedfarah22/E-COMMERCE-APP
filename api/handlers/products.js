const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'masteruser',
    password: "ecommdbpw",
    host: 'ecommdb.covnxnivrrc5.ap-southeast-2.rds.amazonaws.com',
    database: "ecommdb",
    port: 5432,
    ssl: true
})
module.exports.getProducts = async (event) => {
    
try{
   
    const category = event.queryStringParameters && event.queryStringParameters.category

    if(category){
        const result = await pool.query('SELECT * FROM products WHERE category= $1', [category])
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows)
        }
    } else{
            const result = await pool.query('SELECT * FROM products ORDER BY id ASC')
            return {
                statusCode: 200,
                body: JSON.stringify(result.rows)
            }
    }

} catch(error){
    console.error(error)
    return {
        statusCode: 500,
        body: JSON.stringify({error: 'Internal server error'})
    }

}
     
}
//get categories
module.exports.getCategories = async (event) => {
   
    try{
        const result =  await pool.query('SELECT DISTINCT category FROM products');
        return{
            statusCode: 200,
            body: JSON.stringify(result.rows)
        }
    } catch(error){
        console.error(error)
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }
    }
}
//get product by ID
module.exports.getProductById = async (event) => {
    try{
        const id = parseInt(event.pathParameters.id)
        //if id is not valid return 400 and invalid ID
        if(isNaN(id)){
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'Invalid ID'}),
            };
        }
        const result = await pool.query('SELECT * FROM products WHERE id=$1', [id]);
        if(result.rows.length === 0){
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Product not found" })
            
        }
    }
    else{
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows)
        }
    }
    }catch(error){
        console.error(error)
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }
    }
}
//create new prdouct
module.exports.post = async (event) => {
    
    try{
    //if no body object is supplied
        const requestBody = JSON.parse(event.body);
        
        if (!requestBody) {
            return {
                statusCode: 400,
                body: JSON.stringify({ msg: 'Please supply valid JSON data' })
            };
        }
        
     else{
        //access body object for product creation
        const {product_name, product_description, category, price, available_quantity, image_url} = requestBody
        //insert product object into db
        const result = await pool.query('INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [product_name, product_description, category, price, available_quantity, image_url]);
        return{
            statusCode: 201,
            body: JSON.stringify(result.rows[0])
        }
    }
    } catch(error){
        
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }

    }
}
//update existing product
module.exports.put = async (event) => {

    try{
    //if no body object is supplied
     const requestBody = JSON.parse(event.body);
        
    if (!requestBody) {
     return {
         statusCode: 400,
         body: JSON.stringify({ msg: 'Please supply valid JSON data' })
     };
 } else{
    const id = parseInt(event.pathParameters.id)
    if(isNaN(id)){
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Invalid ID'}),
        };
    }
    const {product_name, product_description, price, available_quantity}  =requestBody
    const result = await pool.query('UPDATE products SET product_name=$1, product_description=$2, price=$3, available_quantity=$4 WHERE id=$5 RETURNING *', [product_name, product_description, price, available_quantity, id])
    if(result.rows.length === 0){
        return {
            statusCode: 404,
            body: JSON.stringify({error: 'Product not found'})
        }
    } else{
        return {
            statusCode: 200,
            body: JSON.stringify(result.rows[0])
        }
    }

 }
    } catch(error){
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }

    }
}
//delete existing product
module.exports.delete = async (event) => {
    try {
        const id = parseInt(event.pathParameters.id)
        if(isNaN(id)){
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'Invalid ID'}),
            };
        }
        const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);
        if(result.rows.length === 0){
            return{
                statusCode: 404,
                body: JSON.stringify({error: 'Product not found'})
            }
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({message: `Product deleted with ID: ${id}`})
            }
        }

    } catch(error){
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }
    }
}