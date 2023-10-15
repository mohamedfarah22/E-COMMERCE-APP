const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 4000
const cors = require('cors');
const passport = require('passport')
const session = require('express-session')
const pool  = require('./dbConfig')
//require elastic search functions
const elasticSearch = require('./src/queries/elasticSearch')

//require products router


const productsRouter = require('./src/Routers/productsRouter.js')(pool)
const authRouter = require('./src/Routers/authRouter.js')(pool)
const usersRouter = require('./src/Routers/usersRouter.js')(pool)
const cartsRouter = require('./src/Routers/cartRouter.js')(pool)
const stripeRouter = require('./src/Routers/stripeRouterCheckout.js')
const searchRouter = require('./src/Routers/searchRouter.js')
//use cors
app.use(cors());
//use body parser
app.use(bodyParser.json())
//attach db to app

//create express session
app.use(
  session({
    secret: "qEas5ns3gxl41G",
    cookie: { maxAge: 86400000, secure: false },
    resave: false,
    saveUninitialized: false
  })
 );

//initialise passport and session

app.use(passport.initialize());
app.use(passport.session());
//create index and bulk updated index in elasticsearch with product data
//do not index products to elastic search if node_env is test
if (process.env['NODE_ENV'] !== 'test' && process.env['NODE_ENV'] !== 'render-deployment' && process.env['NODE_ENV'] !== 'pg-test-error' && process.env['NODE_ENV'] !== 'unit-tests') {
elasticSearch.createIndex().then(() => elasticSearch.indexProductData()).catch(error => console.error("Error: ", error));
}

//load database with product data
const sqlScripts = async (pool) => {
await pool.query(`GRANT ALL PRIVILEGES ON DATABASE ecomm_database TO ecomm_database_user`)
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
await pool.query(`
        INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
        VALUES
    ('Elegant Gold Bangle', 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.', 'bangles', 1100, 10, './bangle.jpeg'),
    ('Dainty Gold Bangle', 'Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.','bangles', 1350, 7, './bangle.jpeg'),
    ('Luxurious Gold Bangle', 'Indulge in opulence with this luxurious gold bangle, weighing a lavish 20 grams. The gleaming gold and ornate detailing create a statement piece that exudes grandeur.', 'bangles', 2250, 15, './bangle.jpeg'),
    ('Elegant Gold Earrings', 'Elevate your elegance with these elegant gold earrings, each weighing a dainty 5 grams. Their intricate design and lightweight feel make them perfect for adding a touch of sophistication to any outfit.', 'earrings', 350, 10, './earrings.jpeg'),
    ('Dazzling Gold Earrings', 'Indulge in luxury with these dazzling diamond earrings, weighing a glamorous 10 grams. The sparkling diamonds and exquisite craftsmanship create a statement piece that captures attention.', 'earrings', 1499.99, 15, './earrings.jpeg'),
    ('Charming Gold Earrings', 'Embrace classic charm with these charming pearl earrings, each weighing a delicate 3 grams. The lustrous pearls and timeless design make them an ideal accessory for both casual and formal occasions.', 'earrings', 299.99, 25, './earrings.jpeg'),
    ('Classic Gold Chain Necklace', 'Elevate your style with this classic gold chain necklace, weighing a substantial 15 grams. Its timeless design and durable construction make it a versatile accessory for any occasion.', 'necklaces', 899.99, 10, './necklaces.jpeg'),
    ('Glamorous Gold Pendant Necklace', 'Make a statement with this glamorous pendant necklace, weighing 8 grams. The intricate pendant and shimmering chain create a stunning focal point for your ensemble.', 'necklaces', 599.99, 12, './necklaces.jpeg'),
    ('Chic Gold Choker Necklace', 'Elevate your neckline with this chic gold choker necklace, weighing 6 grams. Its modern design and comfortable fit make it an ideal accessory for both casual and formal looks.', 'necklaces', 449.99, 15, './necklaces.jpeg'),
    ('Classic Gold Band Ring', 'Embrace timeless elegance with this classic gold band ring, weighing 6 grams. Its simple yet sophisticated design makes it a versatile accessory for any occasion.', 'rings', 499.99, 15, './rings.jpeg'),
    ('Sparkling Gold Halo Ring', 'Radiate brilliance with this diamond halo ring, weighing 4.5 grams. The dazzling center diamond is surrounded by a halo of smaller diamonds for maximum sparkle.', 'rings', 899.99, 8, './rings.jpeg'),
    ('Delicate Gold Stackable Ring', 'Create your own unique stack with this delicate gold ring, weighing 2 grams. Its slim design allows you to mix and match for a personalized look.', 'rings', 249.99, 20, 'http://localhost:8080/images/rings.jpeg');`
)
await pool.query('DROP TABLE IF EXISTS users');
await pool.query(`CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL
)`)
await pool.query('DROP TABLE IF EXISTS carts');
await pool.query(`CREATE TABLE carts(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(id)
)`)
}
//run on render deployment only
if(process.env['NODE_ENV'] === 'render-deployment'){
  sqlScripts(pool)
}



//Mount the router at products path

app.use('/products', productsRouter)

//Mount auth router

app.use('/auth', authRouter)

//mount users router

app.use('/users', usersRouter)

//mount carts router
app.use('/carts', cartsRouter)

//mount stripe router
app.use('/check-out', stripeRouter)

//mount search router
//do not mount search router for render deployment
if( process.env['NODE_ENV'] !== 'render-deployment' ){
app.use('/search', searchRouter)
}
//make sure node_env is not test before allowing express to listen
if (process.env['NODE_ENV'] !== 'test' && process.env['NODE_ENV'] !== 'unit-tests') {
  app.listen(port, () => {
    console.log(`E-commerce app listening on ${port}`)
  })
  
}

//export app 

module.exports = app;