const stripe = require('stripe')('sk_test_51Np5AOLxfJykJ5Q6fYJ4Amv6DmOwzyKOQMGotSZ8A1rkNo7lXv9WmfeozbEJkPj2MCvSHu9Mv6wkTAVdvS0MQ94w00tPwJSP5K');
const YOUR_DOMAIN = 'https://luxuria.com';
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'masteruser',
    password: "ecommdbpw",
    host: 'ecommdb.covnxnivrrc5.ap-southeast-2.rds.amazonaws.com',
    database: "ecommdb",
    port: 5432,
    ssl: true
})

module.exports.stripeCheckOut = async (event) => {
    try {
        const cartItems = JSON.parse(event.body);
        let lineItems = []; //array to be passed to checkout Session;
        
    const lineItemPromises = cartItems.map(async (item) => {
        const product_id = parseInt(item.product_id);
        const quantity = parseInt(item.quantity);
  
        const productData = await pool.query(
          'SELECT product_name, price FROM carts JOIN products ON carts.product_id = products.id WHERE product_id = $1',
          [product_id]
        );
  
        const customAmount = productData.rows[0].price * 100;
        const price = await stripe.prices.create({
          unit_amount: customAmount,
          currency: 'aud',
          product_data: {
            name: productData.rows[0].product_name,
          },
        });
  
        return {
          price: price.id,
          quantity: quantity,
        };
      });
      lineItems = await Promise.all(lineItemPromises);

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}`,
      });
      return {
        statusBody: 200,
        body: JSON.stringify({ url: session.url }),
      }



    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
          };
    }
}
