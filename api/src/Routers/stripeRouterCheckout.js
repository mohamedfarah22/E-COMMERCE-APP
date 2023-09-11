// This is your test secret API key.
const stripe = require('stripe')('sk_test_51Np5AOLxfJykJ5Q6fYJ4Amv6DmOwzyKOQMGotSZ8A1rkNo7lXv9WmfeozbEJkPj2MCvSHu9Mv6wkTAVdvS0MQ94w00tPwJSP5K');
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
const lineItemPromises = cartItems.map(async (item) => {
    const product_id = parseInt(item.product_id); 
    const quantity = parseInt(item.quantity)
   const productData =  await pool.query(
        'SELECT product_name, price FROM carts JOIN products ON carts.product_id = products.id WHERE product_id = $1',
        [product_id]
      );
      
      const customAmount = productData.rows[0].price * 100;
      const price = await stripe.prices.create({
        unit_amount: customAmount,
        currency: 'aud',
        product_data: {
          name: productData.rows[0].product_name,
         
        }
    });
    return {
        price: price.id,
        quantity: quantity,
      };
    
})
lineItems = await Promise.all(lineItemPromises);   


  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.json({url: session.url})
});
module.exports = router;