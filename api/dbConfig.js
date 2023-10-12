const Pool = require('pg').Pool;

let pool;

if(process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'search-router-test') {
    //use test database
    pool =  new Pool({
        user:"admin",
        password: "ecommdbtest",
         host: "localhost",
        database: "ecommercedatabasetest",
        port: 5433
    })
} 

else if(process.env.NODE_ENV === 'render-deployment'){
    pool = new Pool({
       connectionString: 'postgres://ecomm_database_user:RJ6FqIo1vd0kq9LwmdebNympIyEteJsg@dpg-ckh33u6afg7c73fmoqug-a/ecomm_database'
    })
}
else if(process.env.NODE_ENV === 'unit-tests'){

 pool = new Pool({});

 pool.query =jest.fn((query, values, callback) => {
    if(typeof values === 'function'){
        callback=values
        values=undefined
    }
    if (query === 'SELECT * FROM products ORDER BY id ASC') {
        
        callback(null, {
        rows: [
          {
            id: 1,
            product_name: 'Elegant Gold Bangle',
            product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.',
            category: 'bangles',
            price: 1100,
            available_quantity: 10,
            image_url: 'http://localhost:8080/images/bangle.jpeg',
          },
          {id: 2, product_name:'Elegant Gold Earrings', product_description: 'Elevate your elegance with these elegant gold earrings, each weighing a dainty 5 grams. Their intricate design and lightweight feel make them perfect for adding a touch of sophistication to any outfit.',
        category:'earrings', price: 350, available_quantity: 10, image_url: 'http://localhost:8080/images/earrings.jpeg' }
        ],
      });

}
if (query === 'SELECT * FROM products WHERE category= $1'){
    callback(null, {
        rows: [
            {
            id: 1,
            product_name: 'Elegant Gold Bangle',
            product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.',
            category: 'bangles',
            price: 1100,
            available_quantity: 10,
            image_url: 'http://localhost:8080/images/bangle.jpeg'
            }
        ]
    })
        
}
if (query === 'SELECT DISTINCT category FROM products'){
    callback(null, {
        rows:[
        {
            category : 'bangles'
    
        },
        {
            category : 'earrings'
    
        }
    ]
    })
}
if(query === 'SELECT * FROM products WHERE id=$1' ){
    
    callback(null, {
        rows : [
        {
            id: 2, 
            product_name:'Elegant Gold Earrings', 
            product_description: 'Elevate your elegance with these elegant gold earrings, each weighing a dainty 5 grams. Their intricate design and lightweight feel make them perfect for adding a touch of sophistication to any outfit.',
            category:'earrings', 
            price: 350, 
            available_quantity: 10, 
            image_url: 'http://localhost:8080/images/earrings.jpeg' 
    }

        ]
    })
}
if(query === 'INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'){
    callback(null, {
        rows: [
            {
                id: 5,
                product_name:'Dainty Gold Bangle',
                product_description:  `Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.`,
                category: 'bangles',
                price: 99.99,
                available_quantity: 12,
                image_url: 'http://localhost:8080/images/bangle.jpeg'
        
            }
        ]
        
    })
}
if(query === 'UPDATE products SET product_name=$1, product_description=$2, price=$3, available_quantity=$4 WHERE id=$5 RETURNING *'){
    callback(null, {
        rows: [
            {
                id: 5,
                product_name:'Dainty Gold Bangle',
                product_description:  `Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.`,
                category: 'bangles',
                price: 99.99,
                available_quantity: 12,
                image_url: 'http://localhost:8080/images/bangle.jpeg'
        
            }
        ]
        
    })
}
if(query ==='DELETE FROM products WHERE id=$1 RETURNING *'){
    callback(null, {
        rows: [
            {
                id: 5,
                product_name:'Dainty Gold Bangle',
                product_description:  `Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.`,
                category: 'bangles',
                price: 99.99,
                available_quantity: 12,
                image_url: 'http://localhost:8080/images/bangle.jpeg'
        
            }
        ]
        
    })
}
 })


}



else{
    //use production database
    pool = new Pool({
        user:"admin",
        password: "ecommdb",
        host: "ecomm-database-postgres",
        database: "ecommercedatabase",
        port: 5432
    })
}
 module.exports = pool