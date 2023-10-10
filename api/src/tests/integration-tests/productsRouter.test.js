//import pg pool, router and express
const pool = require('../../../dbConfig')
const app = require('../../../server')
const request  = require('supertest')
//create mock pool to simulate db errors


//set as test incaase 
process.env.NODE_ENV = 'test';
describe('Test Products router success path and search router', () => {
   

    beforeAll(async () => {
        
        //drop table if exists and create product table
        await pool.query(`GRANT ALL PRIVILEGES ON DATABASE ecommercedatabasetest TO admin`)
        await pool.query('DROP TABLE IF EXISTS products');
        await pool.query(`CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            product_name VARCHAR NOT NULL,
            product_description TEXT NOT NULL,
            category VARCHAR NOT NULL,
            price FLOAT NOT NULL,
            available_quantity INTEGER,
            image_url VARCHAR
        )`)
        //add sample of products data 1 item per category
        await pool.query(`
        INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
        VALUES
    ('Elegant Gold Bangle', 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.', 'bangles', 1100, 10, 'http://localhost:8080/images/bangle.jpeg'),
    ('Elegant Gold Earrings', 'Elevate your elegance with these elegant gold earrings, each weighing a dainty 5 grams. Their intricate design and lightweight feel make them perfect for adding a touch of sophistication to any outfit.', 'earrings', 350, 10, 'http://localhost:8080/images/earrings.jpeg'),
    ('Classic Gold Chain Necklace', 'Elevate your style with this classic gold chain necklace, weighing a substantial 15 grams. Its timeless design and durable construction make it a versatile accessory for any occasion.', 'necklaces', 899.99, 10, 'http://localhost:8080/images/necklaces.jpeg'),
    ('Classic Gold Band Ring', 'Embrace timeless elegance with this classic gold band ring, weighing 6 grams. Its simple yet sophisticated design makes it a versatile accessory for any occasion.', 'rings', 499.99, 15, 'http://localhost:8080/images/rings.jpeg');


`)


});

    it('returns all products in json format and sends status of 200', async () => {
       
        //get products from router
        const response= await request(app).get('/products');

        //assertions
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        //assert array of products
        const expectedProducts = [{id: 1, product_name: 'Elegant Gold Bangle', product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.',
        category:'bangles', price: 1100, available_quantity: 10, image_url: 'http://localhost:8080/images/bangle.jpeg' },
        {id: 2, product_name:'Elegant Gold Earrings', product_description: 'Elevate your elegance with these elegant gold earrings, each weighing a dainty 5 grams. Their intricate design and lightweight feel make them perfect for adding a touch of sophistication to any outfit.',
        category:'earrings', price: 350, available_quantity: 10, image_url: 'http://localhost:8080/images/earrings.jpeg' },
        {id: 3, product_name:'Classic Gold Chain Necklace', product_description: 'Elevate your style with this classic gold chain necklace, weighing a substantial 15 grams. Its timeless design and durable construction make it a versatile accessory for any occasion.',
        category:'necklaces', price: 899.99, available_quantity: 10, image_url: 'http://localhost:8080/images/necklaces.jpeg'},
        {id: 4, product_name:'Classic Gold Band Ring', product_description: 'Embrace timeless elegance with this classic gold band ring, weighing 6 grams. Its simple yet sophisticated design makes it a versatile accessory for any occasion.',
        category:'rings', price: 499.99, available_quantity: 15, image_url: 'http://localhost:8080/images/rings.jpeg'}
        ]
        
       expect(response.body).toStrictEqual(expectedProducts)

    })
    it('returns products in json format in the rings category and status of 200' , async() => {
         //get products from router
         const response= await request(app).get('/products?category=rings');

         //assertions
         expect(response.status).toBe(200);
         expect(response.type).toBe('application/json');
         expect(Array.isArray(response.body)).toBe(true);
         //assert array of products
         const expectedProduct = [
         {id: 4, product_name:'Classic Gold Band Ring', product_description: 'Embrace timeless elegance with this classic gold band ring, weighing 6 grams. Its simple yet sophisticated design makes it a versatile accessory for any occasion.',
         category:'rings', price: 499.99, available_quantity: 15, image_url: 'http://localhost:8080/images/rings.jpeg'}
         ]
         
        expect(response.body).toStrictEqual(expectedProduct)

    })
    it('returns products in json format where id is 4' , async() => {
        //get products from router
        const response= await request(app).get('/products/4');
        
        //assertions
        expect(response.status).toBe(200);
        expect(response.type).toBe('application/json');
        expect(Array.isArray(response.body)).toBe(true);
        //assert array of products
        const expectedProduct = [
        {id: 4, product_name:'Classic Gold Band Ring', product_description: 'Embrace timeless elegance with this classic gold band ring, weighing 6 grams. Its simple yet sophisticated design makes it a versatile accessory for any occasion.',
        category:'rings', price: 499.99, available_quantity: 15, image_url: 'http://localhost:8080/images/rings.jpeg'}
        ]
        
       expect(response.body).toStrictEqual(expectedProduct)

   })
   it('returns a 404 error with product not found' , async() => {
    //get products from router
    const response= await request(app).get('/products/5');
 
    //assertions
    expect(response.status).toBe(404);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    //assert array of products
    const expectedValue = {
        error: "Product not found"
    }
    
    
    
   expect(response.body).toStrictEqual(expectedValue)

})
   it('returns an array of key value objects with each category type and sets staus as 200' , async() => {
    //get products from router
    const response= await request(app).get('/products/categories');
 
    //assertions
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
    //assert array of products
    const expectedValue = [{
        category: 'earrings'
    },
    {
        category: 'necklaces'
    },
    {
        category: 'bangles'

    },
    {
        category: 'rings'

    }]
    
    
   expect(response.body).toStrictEqual(expectedValue)

})
it('adds products to products table and returns added product and sets status of 201' , async() => {
    //product data to be sent in post request
    const productData= {
        id: 5,
        product_name:'Dainty Gold Bangle',
        product_description:  `Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.`,
        category: 'bangles',
        price: 99.99,
        available_quantity: 12,
        image_url: 'http://localhost:8080/images/bangle.jpeg'

    }
    //get products from router
    const response= await request(app).post('/products').send(productData);
 
    //assertions
    expect(response.status).toBe(201);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    //assert array of products
    
    
    
   expect(response.body).toStrictEqual(productData)

})
it('updates existing product in products table and sends product ID and 201 status when successful' , async() => {
    //product data to be sent in post request
    const productIdToUpdate= 1;
   
    const productToUpdate= {
        id: 1,
        product_name:'Dainty Gold Bangle',
        product_description: 'elegant piece made for a special ocassion',
        category: 'bangles',
        price: 389.60,
        available_quantity: 6,
        image_url: 'http://localhost:8080/images/bangle.jpeg'

    }
    //get products from router
    const response= await request(app).put(`/products/${productIdToUpdate}`).send(productToUpdate);
 
    //assertions
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    //assert array of products
    
    
    
   expect(response.body).toStrictEqual(productToUpdate)

})
it('returns 404 when product id to update not found not found' , async() => {
    //product data to be sent in post request
    const productIdToUpdate= 7;
   
    const productToUpdate= {
        id: 1,
        product_name:'Dainty Gold Bangle',
        product_description: 'elegant piece made for a special ocassion',
        category: 'bangles',
        price: 389.60,
        available_quantity: 6,
        image_url: 'http://localhost:8080/images/bangle.jpeg'

    }
    //get products from router
    const response= await request(app).put(`/products/${productIdToUpdate}`).send(productToUpdate);
 
    //assertions
    expect(response.status).toBe(404);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    //assert array of products
    
    
    
   expect(response.body).toStrictEqual({ error: "Product not found" })

})

it('returns 200 and product ID when product is deleted' , async() => {
    //product data to be sent in post request
    const productIdToDelete= 1;
  
    //get products from router
    const response= await request(app).delete(`/products/${productIdToDelete}`);
 
    //assertions
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    //assert array of products
    
    
    
   expect(response.body).toStrictEqual({ message: `Product deleted with ID: ${productIdToDelete}` })

})

it('returns 404 error message when product ID is invalid' , async() => {
    //product data to be sent in post request
    const productIdToDelete= 11;
  
    //get products from router
    const response= await request(app).delete(`/products/${productIdToDelete}`);
 
    //assertions
    expect(response.status).toBe(404);
    expect(response.type).toBe('application/json');
    expect(typeof response.body).toBe('object');
    //assert array of products
    
    
    
   expect(response.body).toStrictEqual({ error: "Product not found" })

})
it('search router should return status code of 200 and products matching on product name and query', async() => {
    process.env['NODE_ENV'] = 'search-router-test'
    const response = await request(app).get('/search?q=Elegant')
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
     expect(response.body[0]._source.product_name).toBe('Elegant Gold Earrings')
})
it('search router should return status code of 200 and products matching on product description and query', async() => {
    process.env['NODE_ENV'] = 'search-router-test'
    const response = await request(app).get('/search?q=Elevate')
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
    expect(Array.isArray(response.body)).toBe(true);
     expect(response.body[0]._source.product_description).toBe('Elevate your style with this classic gold chain necklace, weighing a substantial 15 grams. Its timeless design and durable construction make it a versatile accessory for any occasion.')
})
afterAll(() => {
   
    pool.end()
   
    })
})

//describe('Test products router failure paths')
process.env.NODE_ENV ='pg-test-error'
describe('Test products router server errors', () => {
    
    it('should return a server error when there is a database error in get products', async () => {
       
        const response = await request(app).get('/products');

        // Expect a 500 status code in the response
        expect(response.status).toBe(500);

        // Optionally, check the response body for an error message
        expect(response.body).toEqual({ error: "Internal server error" });
    });
    it('should return a server error when there is a database error in get products by category', async () => {
       
        const response = await request(app).get('/products?category=bangles');

        // Expect a 500 status code in the response
        expect(response.status).toBe(500);

        // Optionally, check the response body for an error message
        expect(response.body).toEqual({ error: "Internal server error" });
    });
    it('should return a server error when there is a database error in get product categories', async () => {
        
        const response = await request(app).get('/products/categories');

        // Expect a 500 status code in the response
        expect(response.status).toBe(500);

        // Optionally, check the response body for an error message
        expect(response.body).toEqual({ error: "Internal server error" });
    });
    it('should return a server error when there is a database error in get product by ID', async () => {
        
        const response = await request(app).get('/products/1');

        // Expect a 500 status code in the response
        expect(response.status).toBe(500);

        // Optionally, check the response body for an error message
        expect(response.body).toEqual({ error: "Internal server error" });
    });
    it('should return a server error when there is a database error in create new product', async () => {

        //product data to be sent in post request
    const productData= {
        id: 5,
        product_name:'Dainty Gold Bangle',
        product_description:  `Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.`,
        category: 'bangles',
        price: 99.99,
        available_quantity: 12,
        image_url: 'http://localhost:8080/images/bangle.jpeg'

    }
    //get products from router
    const response= await request(app).post('/products').send(productData);
        // Expect a 500 status code in the response
        expect(response.status).toBe(500);

        // Optionally, check the response body for an error message
        expect(response.body).toEqual({ error: "Internal server error" });
    });
    it('should return a server error when there is a database error in delete product', async () => {
        
        const productIdToDelete= 1;
  
        //get products from router
        const response= await request(app).delete(`/products/${productIdToDelete}`);
        // Expect a 500 status code in the response
        expect(response.status).toBe(500);

        // Optionally, check the response body for an error message
        expect(response.body).toEqual({ error: "Internal server error" });
    });
    

});


