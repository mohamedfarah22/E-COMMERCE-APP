const cartsLambda = require("../carts") //import carts router
const Pool = require('pg').Pool
const lambdaTester = require('lambda-tester');

jest.mock('pg', () => {
    const pool  = {
        query: jest.fn()
    }
    return {Pool: jest.fn(() => pool)};
})

//happy path
describe('carts endpoint functions happy path', () => {
    let pool;
    beforeEach(() => {
        pool = new Pool({
            ssl: false
        })
    })
    afterEach(() => {
        jest.clearAllMocks()
    })
    it("should send status code of 200 and return all carts for getAllCarts", async () => {
        const expectedData =[{user_id: 123, product_id: 13, quantity:3}]
       pool.query.mockResolvedValue({rows:  expectedData })
       const event = {}
        const result = await lambdaTester(cartsLambda.getAllCarts).event(event).expectResult();
       expect(pool.query).toBeCalledTimes(1);
       expect(pool.query).toHaveBeenCalledWith('SELECT * FROM carts ORDER BY id ASC')
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify(expectedData))
    })
    it("should send status of 400 when no user ID is passed into the event object with message of invalid user id fot getCartTotal", async () => {
        const event = {
            queryStringParameters: {
               
            }
        }
        
        const result = await lambdaTester(cartsLambda.getCartTotal).event(event).expectResult();
        expect(result.statusCode).toBe(400);
        expect(result.body).toEqual(JSON.stringify({message: 'invalid user id'}))

    })
    it("should send status of 200 and object with total cost when event with user ID is passed in to getCartTotal", async () => {
        const event = {
            queryStringParameters: {
                user_id: 'myuserid'
               
            }
        }
        pool.query.mockResolvedValue({rows:[{total_cost:1100}]})
        const result = await lambdaTester(cartsLambda.getCartTotal).event(event).expectResult();
        expect(pool.query).toBeCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith('SELECT SUM(quantity * price) AS total_cost FROM carts JOIN products ON carts.product_id = products.id WHERE carts.user_id = $1', ["myuserid"])
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify({total_cost: 1100}))

    })
    it("should send status code of 200 when user id and product id match in getUserProductQueries lambda", async () => {
        const event = {
            queryStringParameters: {
                user_id: 'myuserid',
                product_id:1
               
            }
        }
        const expectedData =[{user_id: 123, product_id: 13, quantity:3}]
        pool.query.mockResolvedValue({rows:  expectedData })
        const result = await lambdaTester(cartsLambda.getUserCartProduct).event(event).expectResult();
        expect(pool.query).toBeCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM carts WHERE user_id = $1 AND product_id = $2', ['myuserid', 1])
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify(expectedData))
    })  
    it("should send status code of 404 product id is not a number in getUserProductQueries lambda", async () => {
        const event = {
            queryStringParameters: {
                user_id: 'myuserid',
                product_id:"not a number"
               
            }
        }
        const result = await lambdaTester(cartsLambda.getUserCartProduct).event(event).expectResult();
        expect(result.statusCode).toBe(404);
        expect(result.body).toEqual(JSON.stringify({message: 'invalid product ID, product Id must be a number'}))
    })  
    it("should send status code of 404 when user id and product id match no rows in getUserProductQueries lambda", async () => {
        const event = {
            queryStringParameters: {
                user_id: 'myuserid',
                product_id:1
               
            }
        }
        const expectedData= []
        pool.query.mockResolvedValue({rows:  expectedData })
        const result = await lambdaTester(cartsLambda.getUserCartProduct).event(event).expectResult();
        expect(result.statusCode).toBe(404);
        expect(result.body).toEqual(JSON.stringify({ message: 'No matching rows found' }))
    })  
it("should send status 400 and message of supply valid json if post req to cart post is made with no body post" , async () => {
    const event = {}
    const result = await lambdaTester(cartsLambda.post).event(event).expectResult();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({ message: 'Please supply valid JSON data' }))
})
it("should send status of 200 and return inserted cart when valid json body is invoked with cart query returning no existing carts in post", async () => {
    const event = {
        body: JSON.stringify({
            "product_id": 5,
            "user_id":"userId",
            quantity: 5
        })
    }
    const expectedData = [{
        product_id: 5,
        user_id:"userId",
        quantity: 5
        }]
    pool.query.mockImplementation((text, values) => {
        
        if (text === 'SELECT * FROM carts WHERE user_id = $1 AND product_id = $2' && values[0] === "userId" && values[1] === 5) {
            return Promise.resolve({ rows: [] });
        } if(text === 'INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *' && values[0] ===  "userId" && values[1] === 5 && values[2] === 5){
            return Promise.resolve({ rows: expectedData });
        }
    })
        
    
    const result = await lambdaTester(cartsLambda.post).event(event).expectResult();
    
    expect(pool.query).toBeCalledTimes(2);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(expectedData))
    
})
it("should send status of 200 and return updated cart when valid json body is invoked with cart query returning valid existing cart items in post", async () => {
    const event = {
        body: JSON.stringify({
            "product_id": 5,
            "user_id":"userId",
            quantity: 5
        })
    }
    const expectedData = [{
        product_id: 5,
        user_id:"userId",
        quantity: 5
        }]
    pool.query.mockImplementation((text, values) => {
        if (text === 'SELECT * FROM carts WHERE user_id = $1 AND product_id = $2' && values[0] === "userId" && values[1] === 5) {
            return Promise.resolve({ rows: [{
                product_id: 5,
                user_id:"userId",
                quantity: 4
                }] });
        }
        if (text === 'UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3' && values[0] === 4 && values[1] === "userId" && values[2] === 5) {
            return Promise.resolve({ rows: expectedData });
        } 
    })
        
    
    const result = await lambdaTester(cartsLambda.post).event(event).expectResult();
    
    expect(pool.query).toBeCalledTimes(2);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify({newQuantity:5}))
    
})
it("should send status of 400 and invalid user id message when no user id is passed into getCartByUserID", async () => {
    const event = {
        pathParameters: {
            
        }
    }
    
    const result = await lambdaTester(cartsLambda.getCartByUserID).event(event).expectResult();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({message: 'invalid user id'}))
    
})
it("should send status of 200 and carts of user id in getCartByUserID", async () => {
    const event = {
        pathParameters: {
            user_id: 'myUserId'
        }
    }
    const expectedValue = [{
        product_id: 5,
        user_id:"myUserId",
        quantity: 4
        },
       {
        product_id: 5,
        user_id:"myUserId",
        quantity: 3
        }
    ]
    pool.query.mockResolvedValue({rows:  expectedValue })
    const result = await lambdaTester(cartsLambda.getCartByUserID).event(event).expectResult();
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(expectedValue))
    
})
it("should send status of 400 and invalid user id or product id message when no user id and product id is passed into deleteCartItem", async () => {
    const event = {
    }
   
    const result = await lambdaTester(cartsLambda.deleteCartItem).event(event).expectResult();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({message: 'invalid user id or product ID'}))
    
})
it("should send status of 400 and invalid user id or product id message when no user id is passed into deleteCartItem", async () => {
    const event = {
        queryStringParameters: {
            product_id: 2
        }
    }
   
    const result = await lambdaTester(cartsLambda.deleteCartItem).event(event).expectResult();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({message: 'invalid user id or product ID'}))
    
})
it("should send status of 400 and invalid user id or product id message when no product id is passed into deleteCartItem", async () => {
    const event = {
        queryStringParameters: {
            product_id: 2
        }
    }
   
    const result = await lambdaTester(cartsLambda.deleteCartItem).event(event).expectResult();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({message: 'invalid user id or product ID'}))
    
})
it("should send status of 400 and invalid user id or product id message when no product id is passed into deleteCartItem", async () => {
    const event = {
        queryStringParameters: {
            product_id: 2,
            user_id: 'myuserid'
        }
    }
   const expectedValue = [{
    product_id: 5,
    user_id:"myUserId",
    quantity: 3
    }]
    pool.query.mockResolvedValue({rows:  expectedValue })
    const result = await lambdaTester(cartsLambda.deleteCartItem).event(event).expectResult();
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(expectedValue))
    
})
it("should send status of 400 and invalid user id or product ID or invalid quantity message when no user id is passed into put", async () => {
    const event = {
        queryStringParameters: {
            product_id: 2,
            quantity: 3
        }
    }
  
    const result = await lambdaTester(cartsLambda.put).event(event).expectResult();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({message: 'invalid user id or product ID or invalid quantity'}))
    
})
it("should send status of 400 and invalid user id or product ID or invalid quantity message when no product id id is passed into put", async () => {
    const event = {
        queryStringParameters: {
            user_id:  "myUserId",
            quantity: 3
        }
    }
  
    const result = await lambdaTester(cartsLambda.put).event(event).expectResult();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({message: 'invalid user id or product ID or invalid quantity'}))
    
})
it("should send status of 400 and invalid user id or product ID or invalid quantity message when no product id id is passed into put", async () => {
    const event = {
        queryStringParameters: {
            user_id:  "myUserId",
            product_id: 2
        }
    }
  
    const result = await lambdaTester(cartsLambda.put).event(event).expectResult();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({message: 'invalid user id or product ID or invalid quantity'}))
    
})
it("should send status of 400 and Invalid quantity, quantity is not a number message when invalid data type of quantity is passed into put", async () => {
    const event = {
        queryStringParameters: {
            user_id:  "myUserId",
            product_id: 2,
            quantity: 'nan'
        }
    }
  
    const result = await lambdaTester(cartsLambda.put).event(event).expectResult();
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(JSON.stringify({mesage: 'Invalid quantity, quantity is not a number'}))
    
})
it("should send status of 404 and no matching cart item message when product id and user id do not joint correspont to cart item in put", async () => {
    const event = {
        queryStringParameters: {
            user_id:  "myUserId",
            product_id: 2,
            quantity: 3
        }
    }
    pool.query.mockResolvedValue({rows:  []})
    const result = await lambdaTester(cartsLambda.put).event(event).expectResult();
    expect(result.statusCode).toBe(404);
    expect(result.body).toEqual(JSON.stringify({message: 'No matching cart item found.'}))
    
})
})
describe('carts endpoint functions error path', () => {
    let pool;
    beforeEach(() => {
        pool = new Pool({
            ssl: false
        })
    })
    afterEach(() => {
        jest.clearAllMocks()
    })
    it('should send status of 500 and internal server error message when db error occurs on getAllCarts', async() => {
        const expectedResponse  = {error: 'Internal server error'}
        pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
         const event = {}
        const result = await lambdaTester(cartsLambda.getAllCarts).event(event).expectResult();
        
        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual(JSON.stringify(expectedResponse))
    })
    it('should send status of 500 and internal server error message when db error occurs on getCartTotal', async() => {
        const expectedResponse  = {error: 'Internal server error'}
        pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
        const event = {
            queryStringParameters: {
                user_id: 'myuserid'
               
            }
        }
        const result = await lambdaTester(cartsLambda.getCartTotal).event(event).expectResult();
        
        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual(JSON.stringify(expectedResponse))
    })
    it('should send status of 500 and internal server error message when db error occurs on getUserCartProduct', async() => {
        const expectedResponse  = {error: 'Internal server error'}
        pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
        const event = {
            queryStringParameters: {
                user_id: 'myuserid',
                product_id: 1
               
            }
        }
        const result = await lambdaTester(cartsLambda.getUserCartProduct).event(event).expectResult();
          
        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual(JSON.stringify(expectedResponse))
    })
    it('should send status of 500 and internal server error message when db error occurs on post', async() => {
        const expectedResponse  = {error: 'Internal server error'}
        pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
        const event = {
            body: JSON.stringify({
                "product_id": 5,
                "user_id":"userId",
                quantity: 5
            })
        }
        const result = await lambdaTester(cartsLambda.post).event(event).expectResult();
          
        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual(JSON.stringify(expectedResponse))
    })
    it('should send status of 500 and internal server error message when db error occurs on getCartByUserID', async() => {
        const expectedResponse  = {error: 'Internal server error'}
        pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
        const event = {
            pathParameters: {
                user_id: 'myUserId'
            }
        }
        const result = await lambdaTester(cartsLambda.getCartByUserID).event(event).expectResult();
          
        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual(JSON.stringify(expectedResponse))
    })
    it('should send status of 500 and internal server error message when db error occurs on deleteCartItem', async() => {
        const expectedResponse  = {error: 'Internal server error'}
        pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
        const event = {
            queryStringParameters: {
                user_id: 'myUserId',
                product_id:2
            }
        }
        const result = await lambdaTester(cartsLambda.deleteCartItem).event(event).expectResult();
          
        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual(JSON.stringify(expectedResponse))
    })
    it('should send status of 500 and internal server error message when db error occurs on put', async () => {
        const expectedResponse  = {error: 'Internal server error'}
        pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
        const event = {
            queryStringParameters: {
                user_id: 'myUserId',
                product_id: 2, 
                quantity: 5
            }
        }
        const result = await lambdaTester(cartsLambda.put).event(event).expectResult();
        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual(JSON.stringify(expectedResponse))
    })
    })