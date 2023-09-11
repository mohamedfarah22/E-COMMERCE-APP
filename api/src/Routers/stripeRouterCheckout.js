// This is your test secret API key.
const stripe = require('stripe')('sk_test_51LvWkeEeFxbwOuLXqCx6oPXNCUao920X8LudiebuCsyQ3bpBGNtyyOgOV6zqofgWORUOC3aCE8t6MQ6IPT5wMvvO00xEEpscXq');
const express = require('express');
const router= express.Router();
router.use(express.static('public'));
const Pool = require('pg').Pool;

const pool = new Pool({
    user:"admin",
    password: "ecommdb",
    host: "ecomm-database-postgres",
    database: "ecommercedatabase",
    port: 5432
});


const YOUR_DOMAIN = 'http://localhost:3000';

router.post('/', async (req, res) => {
  const cartItems = req.body
  let lineItems = []; //array to be passed to checkout Session;
cartItems.forEach(async (item) => {
    const product_id = item.product_id;
    const quantity = parseInt(item.quantity)
    
   const productData =  await pool.query(
        'SELECT product_name, price FROM carts JOIN products ON carts.product_id = products.id WHERE product_id = $1',
        [product_id]
      );
      const customAmount = item.quantity * productData[0].price;
      const price = await stripe.prices.create({
        unit_amount: customAmount,
        currency: 'aud',
        product_data: {
          name: productData[0].product_name,
         
        }
    });
    lineItems.push({
        price: price.id,
        quantity: quantity,
    })

})
  

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});
module.exports = router;