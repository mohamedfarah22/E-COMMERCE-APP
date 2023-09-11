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
  const{id, product_id, quantity} = req.body
  parseInt(quantity)
  
  //join products and carts table and get name, price description and name
  const { rows: productData } = await pool.query(
    'SELECT product_name, price FROM carts JOIN products ON carts.product_id = products.id WHERE product_id = $1',
    [product_id]
  );
console.log(productData)
  //custom amount is product_price
  const customAmount = productData[0].price * quantity;
  
//create price object
 const price = await stripe.prices.create({
    unit_amount: customAmount,
    currency: 'aud',
    product_data: {
      name: productData[0].product_name,
     
    }
});
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: price.id,
        quantity: quantity,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});
module.exports = router;