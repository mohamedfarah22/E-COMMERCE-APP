const express = require('express')
const bodyParser = require('body-parser')
const Pool = require('pg').Pool
const app = express();
app.use(bodyParser.json())
jest.mock('pg', () => {
    return {
      Pool: jest.fn(() => ({
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
      })),
    };
  });
  
  const pool = new Pool();

const cartsRouter = require('../../Routers/cartRouter')(pool)
const request  = require('supertest');
app.use('/carts',  cartsRouter)
describe('carts router unit test get all carts', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values, callback) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'SELECT * FROM carts ORDER BY id ASC'){
                callback(null, {
                    rows: [
                        {
                            id: 1,
                            user_id: "1",
                            product_id: 1,
                            quantity: 2
                        }
                    ]
                })
            }
            
        })
    })
    it('should set status code to 200 and return all carts', async () => {
        const response = await request(app).get('/carts/all');
        
 // Assert that the response matches your expectations
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toStrictEqual([{
        id: 1,
        user_id: "1",
        product_id: 1,
        quantity: 2
    }])

    })

})
describe('carts router unit test get user-product-queries', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values, callback) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'SELECT * FROM carts WHERE user_id = $1 AND product_id = $2'){
                callback(null, {
                    rows: [
                        {
                            id: 1,
                            user_id: "2",
                            product_id: 3,
                            quantity: 2
                        },
                        {
                            id: 2,
                            user_id: "2",
                            product_id:5,
                            quantity: 1
                        }
                    ]
                })
            }
            })
            
        })
    
    it('should set status code to 200 and return carts by user', async () => {
        const response = await request(app).get('/carts/user-product-queries');
        
 // Assert that the response matches your expectations
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toStrictEqual([
        {
            id: 1,
            user_id: "2",
            product_id: 3,
            quantity: 2
        },
        {
            id: 2,
            user_id: "2",
            product_id:5,
            quantity: 1
        }
    ])

    })

})
describe('carts router create new cart item', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values, callback) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'SELECT * FROM carts WHERE user_id = $1 AND product_id = $2'){
                callback(null, {
                    rows: []
                })
            }
            if(query === 'INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *'){
                callback(null, {
                    rows: [{
                        user_id: "2",
                        product_id:5,
                        quantity: 1
                    }]
                })
            }
            })
            
        })
    
    it('should set status code to 200 and return newly added cart', async () => {
        const response = await request(app).post('/carts').send({
            user_id: "2",
            product_id:5,
            quantity: 1
        });
        
 // Assert that the response matches your expectations
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toStrictEqual([
        {
            user_id: "2",
            product_id:5,
            quantity: 1
        }
    ])

    })

})
describe('carts router create new cart itemcart router updates cart item when cart item already exists', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values, callback) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'SELECT * FROM carts WHERE user_id = $1 AND product_id = $2'){
                callback(null, {
                    rows: [
                        
                            {
                                id: 1,
                                user_id: "2",
                                product_id: 3,
                                quantity: 2
                            }
                    ]
                })
            }
            if(query === 'UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3'){
                callback(null, {
                    rows: [{
                        user_id: "2",
                        product_id:5,
                        quantity: 3
                    }]
                })
            }
            })
            
        })
    
    it('should set status code to 200 and return newly added cart', async () => {
        const response = await request(app).post('/carts').send({
            user_id: "2",
            product_id:5,
            quantity: 1
        });
      
 // Assert that the response matches your expectations
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    expect(response.body).toStrictEqual(
        {newQuantity:3}
    )

    })

})
describe('carts router cget user by ID', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values, callback) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'SELECT * FROM carts WHERE user_id = $1'){
                callback(null, {
                    rows: [
                        
                            {
                                id: 1,
                                user_id: "2",
                                product_id: 3,
                                quantity: 2
                            },
                            {

                                id: 1,
                                user_id: "2",
                                product_id: 4,
                                quantity: 3
                            }
                    ]
                })
            }
           
            })
            
        })
    
    it('should set status code to 200 and return newly added cart', async () => {
        const response = await request(app).get('/carts/2');
      
 // Assert that the response matches your expectations
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toStrictEqual(
        [
                        
            {
                id: 1,
                user_id: "2",
                product_id: 3,
                quantity: 2
            },
            {

                id: 1,
                user_id: "2",
                product_id: 4,
                quantity: 3
            }
    ]
    )

    })

})
describe('carts router deleted cart a users cart item', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values, callback) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'DELETE FROM carts WHERE user_id = $1 AND product_id = $2 RETURNING *'){
                callback(null, {
                    rows: [
                        
                            {
                                id: 1,
                                user_id: "2",
                                product_id: 3,
                                quantity: 2
                            },
                            
                    ]
                })
            }
           
            })
            
        })
    
    it('should set status code to 200 and return newly added cart', async () => {
        const response = await request(app).delete('/carts?user_id=2&product_id=3');
      
 // Assert that the response matches your expectations
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toStrictEqual(
        [
                        
            {
                id: 1,
                user_id: "2",
                product_id: 3,
                quantity: 2
            },
            
    ]
    )

    })

})
describe('carts router update cart quantity should set as 404 and message of no products found', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values, callback) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *'){
                callback(null, {
                    rows: []
                    
                })
            }
           
            })
            
        })
    
    it('should set status code to 200 and return newly added cart', async () => {
        const response = await request(app).put('/carts?user_id=2&product_id=3&quanitity=8');
      
 // Assert that the response matches your expectations
    expect(response.status).toBe(404);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    expect(response.body).toStrictEqual(
        { message: 'No matching cart item found.' }
    )

    })

})
describe('carts router update cart quantity should set as 200 with updated product', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values, callback) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            if(query === 'UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *'){
                callback(null, {
                    rows: [
                        {
                            id: 1,
                            user_id: "2",
                            product_id: 3,
                            quantity: 2
                        }
                    ]
                    
                })
            }
           
            })
            
        })
    
    it('should set status code to 200 and return newly added cart', async () => {
        const response = await request(app).put('/carts?user_id=2&product_id=3&quanitity=8');
      
 // Assert that the response matches your expectations
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toStrictEqual(
        [
            {
                id: 1,
                user_id: "2",
                product_id: 3,
                quantity: 2
            }
        ]
    )

    })

})
describe('carts router get cart total', () => {
    beforeEach(() => {
        pool.query = jest.fn((query, values, callback) => {
            if(typeof values === 'function'){
                callback=values
                values=undefined
            }
            
                
                    callback(null, {
                        rows: [
                            {
                                "total_cost": 3000
                            }
                        ]
                    });
            
            
          
            })
            
        })
    
    it('should set status code to 200 and get cart total by user id', async () => {
        const response = await request(app).get('/carts/cart-total?user_id=3');
      
    // Assert that the response matches your expectations
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    expect(response.body).toStrictEqual(
        
        {
            "total_cost": 3000
        }
    
    )

    }
)

})