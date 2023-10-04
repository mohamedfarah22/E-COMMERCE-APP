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
const authRouter = require('./src/Routers/authRouter.js')
const usersRouter = require('./src/Routers/usersRouter.js')
const cartsRouter = require('./src/Routers/cartRouter.js')
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
if (process.env['NODE_ENV'] !== 'test') {
elasticSearch.createIndex().then(() => elasticSearch.indexProductData()).catch(error => console.error("Error: ", error));
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
app.use('/search', searchRouter)
//make sure node_env is not test before allowing express to listen
if (process.env['NODE_ENV'] !== 'test') {
  app.listen(port, () => {
    console.log(`E-commerce app listening on ${port}`)
  })
  
}

//export app 

module.exports = app;