const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'masteruser',
    password: "ecommdbpw",
    host: 'ecommdb.covnxnivrrc5.ap-southeast-2.rds.amazonaws.com',
    database: "ecommdb",
    port: 5432,
    ssl: true
})
//get all carts
module.exports.getAllCarts = async (event) => {
    try{
        const result = await pool.query('SELECT * FROM carts ORDER BY id ASC');
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 200,
            body: JSON.stringify(result.rows)
        }

    } catch(error){
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }
    }
}
//get cart total
module.exports.getCartTotal = async (event) => {
    try {
        const userId = event.queryStringParameters && event.queryStringParameters.user_id
        if(!userId){
            return{
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 400,
                body: JSON.stringify({message: 'invalid user id'})
            }
        } else{
            const result = await pool.query( 'SELECT SUM(quantity * price) AS total_cost FROM carts JOIN products ON carts.product_id = products.id WHERE carts.user_id = $1', [userId])
            const totalCost = result.rows[0].total_cost;
            return{
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 200,
                body: JSON.stringify({ total_cost: totalCost })
            }

        }
    } catch (error) {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }
    }
}
//get user's products
module.exports.getUserCartProduct = async (event) => {

    try {
        const user_id = event.queryStringParameters && event.queryStringParameters.user_id;
        const product_id = event.queryStringParameters && event.queryStringParameters.product_id;
        if(isNaN(product_id)){
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 404,
                body: JSON.stringify({message: 'invalid product ID, product Id must be a number'})

            }
        }
        const result  = await pool.query('SELECT * FROM carts WHERE user_id = $1 AND product_id = $2', [user_id, product_id])
            if(result.rows.length > 0){
                return {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                       
                      },
                    statusCode: 200,
                    body: JSON.stringify(result.rows)
                }
            }
             else{
                return {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                       
                      },
                    statusCode: 404,
                    body: JSON.stringify({ message: 'No matching rows found' })
                }
            }
        }
     catch (error) {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }
    }
    
    }

//create cart item (double check update quantity functionality)
module.exports.post = async (event) => {
    try { 
      
        if (!event.body) {
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                
                statusCode: 400,
                body: JSON.stringify({ message: 'Please supply valid JSON data' })
            };
        }
        else {
            const requestBody = JSON.parse(event.body);
            //get user id, product id and quantity from body
            const { user_id, product_id, quantity} = requestBody
            //check if cart item exists
            const result = await pool.query('SELECT * FROM carts WHERE user_id = $1 AND product_id = $2',[ user_id, product_id]);
            
            if(result.rows.length === 0){
                //cart does not exist in db so insert and return new cart row
                const result = await pool.query('INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [user_id, product_id, quantity])
                return {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                       
                      },
                    statusCode: 200,
                    body: JSON.stringify(result.rows)
                }
            } else{
                //cart exists so update quantity
                const existingQuantity = result.rows[0].quantity;
                const newQuantity = existingQuantity + 1;
                await pool.query('UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [newQuantity, user_id, product_id])
                return {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                       
                      },
                    statusCode: 200,
                    body: JSON.stringify({newQuantity: newQuantity})
                }
            }

        }
    } catch(error){
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 500,
            body: JSON.stringify({error: 'Internal server error'})
        }
    }
    }

//get cart by userId
module.exports.getCartByUserID = async (event) => {
try{
    const userId = event.pathParameters && event.pathParameters.user_id
    if(!userId){
        return{
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 400,
            body: JSON.stringify({message: 'invalid user id'})
        }
    } 
  else{
    const response = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
           
          },
        statusCode: 200,
        body: JSON.stringify(response.rows)
    }
}
} catch(error){
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
           
          },
        statusCode: 500,
        body: JSON.stringify({error: 'Internal server error'})
    }
}
}

//delete cart item
module.exports.deleteCartItem = async (event) => {
    try {
    const userId = event.queryStringParameters && event.queryStringParameters.user_id
    const productId = event.queryStringParameters && event.queryStringParameters.product_id
    if(!userId || !productId){
        return{
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 400,
            body: JSON.stringify({message: 'invalid user id or product ID'})
        }
    } else{
        const result = await pool.query('DELETE FROM carts WHERE user_id = $1 AND product_id = $2 RETURNING *', [userId, productId])
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 200,
            body: JSON.stringify(result.rows)
        }
    }
} catch(error){
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
           
          },
        statusCode: 500,
        body: JSON.stringify({error: 'Internal server error'})
    }
}

}

//put route for cart, specifically re-setting quantity
module.exports.put = async (event) => {
    try {
    const userId = event.queryStringParameters && event.queryStringParameters.user_id
    const productId = event.queryStringParameters && event.queryStringParameters.product_id
    const quantity = event.queryStringParameters && event.queryStringParameters.quantity
    const parsedQuantity = parseInt(quantity, 10)
    if(!userId || !productId || !quantity){
        return{
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 400,
            body: JSON.stringify({message: 'invalid user id or product ID or invalid quantity'})
        }
    } 
    if(isNaN(parsedQuantity)){
        return{
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 400,
            body: JSON.stringify({mesage: 'Invalid quantity, quantity is not a number'})
        }

    }else{
        const result = await pool.query('UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *', [parsedQuantity, userId, productId])
        if(result.rows.length === 0){
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 404,
                body : JSON.stringify({message: 'No matching cart item found.'})
            }
        } else{
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 200,
                body: JSON.stringify(result.rows)
            }
        
        }
    }
} catch(error){
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
           
          },
        statusCode: 500,
        body: JSON.stringify({error: 'Internal server error'})
    }
}

}