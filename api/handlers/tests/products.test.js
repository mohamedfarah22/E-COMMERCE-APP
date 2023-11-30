const productsLambda = require("../products") //import products router
const Pool = require('pg').Pool
const lambdaTester = require('lambda-tester');
jest.mock('pg', () => {
    const pool  = {
        query: jest.fn()
    }
    return {Pool: jest.fn(() => pool)};
})

  describe('products endpoint unit tests happy path', () =>{
    let pool;
    beforeEach(() => {
        pool = new Pool({
            ssl: false
        })
    })
    afterEach(() => {
        jest.clearAllMocks()
    })
              
    it('should return products when no category is passed in and status code of 200 gor getProducts' , async () => {
        
        const expectedData =[{product_name:'Elegant Gold Bangle', product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.', category: 'bangles', price:1100, available_quantity: 10, image_url: 'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'},
        {product_name: 'Boho Beaded Gold Necklace', product_description: 'Channel bohemian vibes with this beaded gold necklace, weighing 10 grams. The colorful beads and eclectic design create a playful accessory that complements your free-spirited style.', category:'necklaces', price: 2300, available_quantity: 12, image_url: 'http://localhost:8080/images/necklaces.jpeg'}]
       pool.query.mockResolvedValue({rows:  expectedData })
       const event = {
        queryStringParameters:{
            
        }
    }
        const result = await lambdaTester(productsLambda.getProducts).event(event).expectResult();
       expect(pool.query).toBeCalledTimes(1);
       expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products ORDER BY id ASC')
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify(expectedData))
        

    })
    it("should return product of specific category and staus code 200 when product is passed in for getProducts", async () => {
        
        const expectedData =  [{product_name:'Elegant Gold Bangle', product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.', category: 'bangles', price:1100, available_quantity: 10, image_url: 'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'}]
        pool.query.mockResolvedValue( {rows: expectedData})
        const event = {
            queryStringParameters:{
                category: 'bangles'
            }
        }
        const result = await lambdaTester(productsLambda.getProducts).event(event).expectResult();
        expect(pool.query).toBeCalledTimes(1);
       expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products WHERE category= $1', ["bangles"])
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify(expectedData))
    })
    it("should return categories and set status to 200 for getCategories", async () => {
        const expectedData = [{category: 'bangles', category: 'necklaces'}]
        pool.query.mockResolvedValue({rows: expectedData})
        const event = {
            queryStringParameters:{
            }
        } 
        const result = await lambdaTester(productsLambda.getCategories).event(event).expectResult();
        expect(pool.query).toBeCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith('SELECT DISTINCT category FROM products')
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify(expectedData))
    })
    it("should send status 200 for successful product by ID lambda when passed valid number ID for getProductById", async () => {
        const expectedData = [{product_name:'Elegant Gold Bangle', product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.', category: 'bangles', price:1100, available_quantity: 10, image_url: 'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'}]
        pool.query.mockResolvedValue({rows: expectedData})
        const event = {
           pathParameters:{
            id: 1
           }
        } 
        const result = await lambdaTester(productsLambda.getProductById).event(event).expectResult();
        expect(pool.query).toBeCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id=$1', [1])
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify(expectedData))
    })

    it("should send status 404 for successful product by ID lambda when passed valid number ID and there is no match getProductById", async () => {
        const expectedData = []
        pool.query.mockResolvedValue({rows: expectedData})
        const event = {
           pathParameters:{
            id: 1
           }
        } 
        const result = await lambdaTester(productsLambda.getProductById).event(event).expectResult();
        expect(pool.query).toBeCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products WHERE id=$1', [1])
        expect(result.statusCode).toBe(404);
        expect(result.body).toEqual(JSON.stringify({ error: "Product not found" }))
    })
    it("should send status 400 and invalid id message when invalid ID data type is passed for getProductById", async () => {
        const expectedData = []
        pool.query.mockResolvedValue({rows: expectedData})
        const event = {
           pathParameters:{
            id: 'not a number'
           }
        } 
        const result = await lambdaTester(productsLambda.getProductById).event(event).expectResult();
        expect(result.statusCode).toBe(400);
        expect(result.body).toEqual(JSON.stringify({message: 'Invalid ID'}))
    })
    it("should send status 400 and supply valid json message when no body parameter is passed in for post", async () => {
        const event = {}
           
        const result = await lambdaTester(productsLambda.post).event(event).expectResult();
        expect(result.statusCode).toBe(400);
        expect(result.body).toEqual(JSON.stringify({ msg: 'Please supply valid JSON data' }))
    })
    it("should send status 201 and new product row", async () => {
        const event = {
            body: JSON.stringify({
                "product_name": "Cool Product",
                "product_description": "This product is a best seller",
                "category": "1ofnone",
                "price": 12000,
                "available_quantity": 12,
                "image_url": "www.image.com"
            })
        }
        const expectedValue = {product_name: "Cool Product", product_description:"This product is a best seller", 
        category: "1ofnone", price: 12000, available_quantity: 12, image_url: "www.image.com" }
        pool.query.mockResolvedValue({rows: [expectedValue] })
           
        const result = await lambdaTester(productsLambda.post).event(event).expectResult();
        
        expect(result.statusCode).toBe(201);
        expect(result.body).toEqual(JSON.stringify(expectedValue))
    })
    it("should send status 400 and message of supply valid json when no body is submitted with request for put", async () => {
        const event = {
        }
           
        const result = await lambdaTester(productsLambda.put).event(event).expectResult();
       
        expect(result.statusCode).toBe(400);
        expect(result.body).toEqual(JSON.stringify({ msg: 'Please supply valid JSON data' }))
    })
    it("should send status 400 and message of Invalid ID when not a number id is passed in event for put", async () => {
        const event = {
            pathParameters: {
                id:'not a number'
            },
            body: JSON.stringify({
                "product_name": "Cool Product",
                "product_description": "This product is a best seller",
                "category": "1ofnone",
                "price": 12000,
                "available_quantity": 12,
                "image_url": "www.image.com"
            })
        }
           
        const result = await lambdaTester(productsLambda.put).event(event).expectResult();
       
        expect(result.statusCode).toBe(400);
        expect(result.body).toEqual(JSON.stringify({message: 'Invalid ID'}))
    })
    it("should send status 404 and message of product not found when correct body and id is submitted but the ID does not match a product for put", async () => {
        const event = {
            pathParameters: {
                id:1
            },
            body: JSON.stringify({
                "product_name": "Cool Product",
                "product_description": "This product is a best seller",
                "category": "1ofnone",
                "price": 12000,
                "available_quantity": 12,
                "image_url": "www.image.com"
            })
        }
        pool.query.mockResolvedValue({rows: [] }) 
        const result = await lambdaTester(productsLambda.put).event(event).expectResult();
       
        expect(result.statusCode).toBe(404);
        expect(result.body).toEqual(JSON.stringify({error: 'Product not found'}))
    })
    it("should send status 200 and updated product when body and id is submitted correctly and ID matches a product for put", async () => {
        const event = {
            pathParameters: {
                id:1
            },
            body: JSON.stringify({
                "product_name": "Cool Product",
                "product_description": "This product is a best seller",
                "category": "1ofnone",
                "price": 12000,
                "available_quantity": 12,
                "image_url": "www.image.com"
            })
        }
        const expectedValue = {product_name: "Cool Product", product_description:"This product is a best seller", 
        category: "1ofnone", price: 12000, available_quantity: 12, image_url: "www.image.com" }
        pool.query.mockResolvedValue({rows: [expectedValue] }) 
        const result = await lambdaTester(productsLambda.put).event(event).expectResult();
       
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify(expectedValue))
    })
    it("should send status 400 and message of invalid ID when ID passed into event is not a number for delete", async () => {
        const event = {
            pathParameters: {
                id:"not a number"
            }
        }
        
        const result = await lambdaTester(productsLambda.delete).event(event).expectResult();
       
        expect(result.statusCode).toBe(400);
        expect(result.body).toEqual(JSON.stringify({message: 'Invalid ID'}))
    })
    it("should send status 404 and message of product not found when ID passed into event is a number but does not match a product for delete", async () => {
        const event = {
            pathParameters: {
                id:1
            }
        }
        pool.query.mockResolvedValue({rows:[]})
        const result = await lambdaTester(productsLambda.delete).event(event).expectResult();
       
        expect(result.statusCode).toBe(404);
        expect(result.body).toEqual(JSON.stringify({error: 'Product not found'}))
    })
    it("should send status 200 and message of product deleted with path parametert ID when product is deleted", async () => {
        const event = {
            pathParameters: {
                id:1
            }
        }
        const expectedValue = {product_name: "Cool Product", product_description:"This product is a best seller", 
        category: "1ofnone", price: 12000, available_quantity: 12, image_url: "www.image.com" }
        pool.query.mockResolvedValue({rows:[expectedValue]})
        const result = await lambdaTester(productsLambda.delete).event(event).expectResult();
       
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify({message: `Product deleted with ID: 1`}))
    })
  })

  describe('products endpoint functions error path', () => {
    let pool;
    beforeEach(() => {
        pool = new Pool({
            ssl: false
        })
    })
    afterEach(() => {
        jest.clearAllMocks()
    })
       
    it("should return status code of 500 and internal server error when query fails for get all products" , async () => {
       const expectedResponse  ={error: 'Internal server error'}
       const event = {
            queryStringParameters:{
            }
        }
        pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
        const result = await lambdaTester(productsLambda.getProducts).event(event).expectResult();

        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual(JSON.stringify(expectedResponse))
        

    })
    it("should return status code of 500 and internal server error when query fails for get products by category" , async () => {
        const expectedResponse  = {error: 'Internal server error'}
        pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
         const event = {
            queryStringParameters:{
                category: 'bangles'
            }
        }
        const result = await lambdaTester(productsLambda.getProducts).event(event).expectResult();
        
        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual(JSON.stringify(expectedResponse ))
    })
    it("should return status code of 500 and internal server error when query fails for get categories of products" , async () => {
      const expectedResponse  = {error: 'Internal server error'}
      pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
       const event = {
          queryStringParameters:{
            
          }
      }
      const result = await lambdaTester(productsLambda.getCategories).event(event).expectResult();
      
      expect(result.statusCode).toBe(500);
      expect(result.body).toEqual(JSON.stringify(expectedResponse ))
  })
  it("should return status code of 500 and internal server error when query fails for get product by ID" , async () => {
    const expectedResponse  = {error: 'Internal server error'}
    pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
     const event = {
        queryStringParameters:{
          
        }
    }
    const result = await lambdaTester(productsLambda.getProductById).event(event).expectResult();
    
    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(JSON.stringify(expectedResponse ))
})
it("should return status code of 500 and internal server error when create new product query fails" , async () => {
    const expectedResponse  = {error: 'Internal server error'}
    pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
     const event = {
        body: {

        }
     }
    const result = await lambdaTester(productsLambda.post).event(event).expectResult();
    
    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(JSON.stringify(expectedResponse))
})
it("should return status code of 500 and internal server error when update existing product fails" , async () => {
    const expectedResponse  = {error: 'Internal server error'}
    pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
     const event = {
        body: {

        }
     }
    const result = await lambdaTester(productsLambda.put).event(event).expectResult();
    
    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(JSON.stringify(expectedResponse))
})
it("should return status code of 500 and internal server error when delete existing product fails" , async () => {
    const expectedResponse  = {error: 'Internal server error'}
    pool.query.mockRejectedValue(new Error('Invalid connection to databse'))
     const event = {
        body: {

        }
     }
    const result = await lambdaTester(productsLambda.put).event(event).expectResult();
    
    expect(result.statusCode).toBe(500);
    expect(result.body).toEqual(JSON.stringify(expectedResponse))
})
})