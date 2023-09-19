const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 4000
const cors = require('cors');
const passport = require('passport')
const session = require('express-session')
//require elastic search functions
const elasticSearch = require('./src/queries/elasticSearch')
//require products router

const productsRouter = require('./src/Routers/productsRouter.js')
const authRouter = require('./src/Routers/authRouter.js')
const usersRouter = require('./src/Routers/usersRouter.js')
const cartsRouter = require('./src/Routers/cartRouter.js')
const stripeRouter = require('./src/Routers/stripeRouterCheckout.js')
const searchRouter = require('./src/Routers/searchRouter.js')
//use cors
app.use(cors());
//use body parser
app.use(bodyParser.json())

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
elasticSearch.createIndex().then(() => elasticSearch.indexProductData()).catch(error => console.error("Error: ", error));


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
app.listen(port, () => {
  console.log(`E-commerce app listening on ${port}`)
})