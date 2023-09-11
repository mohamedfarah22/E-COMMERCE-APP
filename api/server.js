const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 4000
const cors = require('cors');
const passport = require('passport')
const session = require('express-session')
//require products router

const productsRouter = require('./src/Routers/productsRouter.js')
const authRouter = require('./src/Routers/authRouter.js')
const usersRouter = require('./src/Routers/usersRouter.js')
const cartsRouter = require('./src/Routers/cartRouter.js')
const stripeRouter = require('./src/Routers/stripeRouterCheckout.js')
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
app.listen(port, () => {
  console.log(`E-commerce app listening on ${port}`)
})