const pool = require('../../../dbConfig')
const app = require('../../../server')
const request  = require('supertest')
//set environment as test to connect to test db
process.env.NODE_ENV = 'test';

//test routes success path
describe('test carts router success path', () => {
    beforeAll( async () => {
        
        //add sample cart data
        await pool.query('DROP TABLE IF EXISTS carts');
        
        await pool.query(`CREATE TABLE carts(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER
        )`)
        //create products table and drop table if exists to create join

        //add sample user data
        await pool.query(`
        INSERT INTO carts(user_id, product_id, quantity)
        VALUES
       (1,1,2);`)
       
    })
    it('test get all carts sends status 200 ', async() => {
        const response= await request(app).get('/carts/all');
        //assert
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        const expectedResult = [{
            id: 1,
            user_id: "1",
            product_id: 1,
            quantity: 2
        }]
        expect(response.body).toStrictEqual(expectedResult)
    })
    it('get user cart products returns 200 and send back cart for particulat user', async () => {
        const response= await request(app).get('/carts/user-product-queries?user_id=1&product_id=1');
        //assert
        const expectedResult = [{
            id: 1,
            user_id: "1",
            product_id: 1,
            quantity: 2
        }]
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
       //assert
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toStrictEqual(expectedResult)

    })
    it('add new cart item to cart table and send status of 201', async () => {
        //add cart item
        const cartBody = {
            id: 2,
            user_id: "1",
            product_id: 3,
            quantity: 2
        }
        const response= await request(app).post('/carts').send(cartBody);
        //assert
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toStrictEqual([cartBody])

    })
    it('only update the quantiy of cart item if it already exists in carts table and send 200', async () => {
        //add cart item
        const cartBody = {
            user_id: "1",
            product_id: 1,
            quantity: 1
        }
        const response= await request(app).post('/carts').send(cartBody);
        //assert
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toStrictEqual({newQuantity: 3})

    })
    it('get users cart items and send 200 status code', async () => {
        //add cart item
        const expectedResult= [{
            id: 2,
            user_id: "1",
            product_id: 3,
            quantity: 2
        },
        {
            id: 1,
            user_id: "1",
            product_id: 1,
            quantity: 3
        }
    ]
        const response= await request(app).get('/carts/1')
        //assert
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(response.body).toStrictEqual(expectedResult)

    })
 
    it('updates quantity in cart item for user and product ID', async () => {
        const response = await request(app).put('/carts?user_id=1&product_id=1&quantity=5');
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        
        expect(response.body).toStrictEqual([{
            id: 1,
            user_id: "1",
            product_id: 1,
            quantity: 5 
        }])
    })

    it('deletes cart item from user and product ID and sends deleted product and status of 200', async () => {
        const response = await request(app).delete('/carts?user_id=1&product_id=1');
    
        //assert
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toStrictEqual([ {
            id: 1,
            user_id: "1",
            product_id: 1,
            quantity: 5
        }])
        
        
    })
    
    it('should return user cart total', async() => {
        const response= await request(app).get('/carts/cart-total?user_id=1');
        //assert
       
        expect(response.type).toBe('application/json');
        expect(typeof response.body).toBe('object');
        const expectedResult = {
            total_cost: 1799.98
        }
        expect(response.body).toStrictEqual(expectedResult)
    })
   

    
   
    afterAll(() => {
        
        pool.end()
        
        })
})

//test routes fail
//set env variable as pg-test-error
process.env.NODE_ENV ='pg-test-error'
describe('test cart router failure path', () => {
    it('get all carts error should return status of 500 and internal server error', async () => {
        const response= await request(app).get('/carts/all');
        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({ error: "Internal server error" })

    })
    it('get user cart product error should return status of 500 and internal server error', async () => {
        const response= await request(app).get('/carts/user-product-queries');
        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({ error: "Internal server error" })

    })
    it('add to user cart error should return status of 500 and internal server error', async () => {
        const cartBody = {
            user_id: "1",
            product_id: 1,
            quantity: 1
        }
        const response= await request(app).post('/carts').send(cartBody);
        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({ error: "Internal server error" })

    })
    it("get cart products by user ID should return status of 500 and internal server error", async () => {
        const response= await request(app).get('/carts/1');
        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({ error: "Internal server error" })
    })
    it("delete cart item should return a status of 500 and internal server error", async () => {
        const response = await request(app).delete('/carts?user_id=1&product_id=1');
        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({ error: "Internal server error" })
    })
    it("updates quantity of cart item error should send status of 500 and internal server error", async () => {
        const response = await request(app).delete('/carts?user_id=1&product_id=1');
        expect(response.status).toBe(500);
        expect(response.body).toStrictEqual({ error: "Internal server error" })
    })
})
