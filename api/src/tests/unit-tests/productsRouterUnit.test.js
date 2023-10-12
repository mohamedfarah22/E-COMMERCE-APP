process.env.NODE_ENV = 'unit-tests'

const app = require('../../../server')
const request  = require('supertest')


//test get all products router

describe('all products router', () => {
   
    it('get all products returns status code of 200', async () => {
        
        const response= await request(app).get('/products');
      
        // Assert that the response matches your expectations
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toStrictEqual([{id: 1, product_name: 'Elegant Gold Bangle', product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.',
        category:'bangles', price: 1100, available_quantity: 10, image_url: 'http://localhost:8080/images/bangle.jpeg' },
        {id: 2, product_name:'Elegant Gold Earrings', product_description: 'Elevate your elegance with these elegant gold earrings, each weighing a dainty 5 grams. Their intricate design and lightweight feel make them perfect for adding a touch of sophistication to any outfit.',
        category:'earrings', price: 350, available_quantity: 10, image_url: 'http://localhost:8080/images/earrings.jpeg' }]); 
    })
    it('get product by category returns status code of 200', async () => {
        
        const response= await request(app).get('/products?category=bangles');
      
        // Assert that the response matches your expectations
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toStrictEqual([{id: 1, product_name: 'Elegant Gold Bangle', product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.',
        category:'bangles', price: 1100, available_quantity: 10, image_url: 'http://localhost:8080/images/bangle.jpeg' }]); 
    })
    it('get product categories', async () => {
        
        const response= await request(app).get('/products/categories');
      
        // Assert that the response matches your expectations
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toStrictEqual([
            {
                category : 'bangles'
        
            },
            {
                category : 'earrings'
        
            }
        ]); 
    })
    it('gets product by ID returns status code of 200', async () => {
        
        const response = await request(app).get('/products/2');
      
        // Assert that the response matches your expectations
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toStrictEqual([ {
            id: 2, 
            product_name:'Elegant Gold Earrings', 
            product_description: 'Elevate your elegance with these elegant gold earrings, each weighing a dainty 5 grams. Their intricate design and lightweight feel make them perfect for adding a touch of sophistication to any outfit.',
            category:'earrings', 
            price: 350, 
            available_quantity: 10, 
            image_url: 'http://localhost:8080/images/earrings.jpeg' 
    }]); 
  
    })
    it('adds new product to database and retuns newly added product as well as status of 201 ', async () => {
        
        const response = await request(app).post('/products').send({
            id: 5,
            product_name:'Dainty Gold Bangle',
            product_description:  `Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.`,
            category: 'bangles',
            price: 99.99,
            available_quantity: 12,
            image_url: 'http://localhost:8080/images/bangle.jpeg'
    
        });
      
        // Assert that the response matches your expectations
        expect(response.status).toBe(201);
        expect(response.type).toBe('application/json');
        expect(typeof response.body).toBe('object');
        expect(response.body).toStrictEqual({
            id: 5,
            product_name:'Dainty Gold Bangle',
            product_description:  `Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.`,
            category: 'bangles',
            price: 99.99,
            available_quantity: 12,
            image_url: 'http://localhost:8080/images/bangle.jpeg'
    
        }); 
 
    
    
})
it('updates product correctly and sends status code of 200 ', async () => {
        
    const response = await request(app).put('/products/3').send({
        id: 5,
        product_name:'Dainty Gold Bangle',
        product_description:  `Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.`,
        category: 'bangles',
        price: 99.99,
        available_quantity: 12,
        image_url: 'http://localhost:8080/images/bangle.jpeg'

    });
  
    // Assert that the response matches your expectations
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    expect(response.body).toStrictEqual({
        id: 5,
        product_name:'Dainty Gold Bangle',
        product_description:  `Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.`,
        category: 'bangles',
        price: 99.99,
        available_quantity: 12,
        image_url: 'http://localhost:8080/images/bangle.jpeg'

    }); 
})
it('deletes product correctly and sends status code of 200 with a deleted product ID message ', async () => {
        
    const response = await request(app).delete('/products/3');
  
    // Assert that the response matches your expectations
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    expect(response.body).toStrictEqual({ message: `Product deleted with ID: 3` }); 
})
})
