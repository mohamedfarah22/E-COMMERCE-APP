const Pool = require('pg').Pool;


const dbInitLambdaFunction = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Lambda function executed db commands successfully')
    }
    try{
        const pool = new Pool({
            user: 'masteruser',
            password: "ecommdbpw",
            host: 'ecommdb.covnxnivrrc5.ap-southeast-2.rds.amazonaws.com',
            database: "ecommdb",
            port: 5432,
            ssl: true
        })
        await pool.query(`GRANT ALL PRIVILEGES ON DATABASE ecommdb TO masteruser`)
        await pool.query('DROP TABLE IF EXISTS carts');
        await pool.query('DROP TABLE IF EXISTS products');
        await pool.query('DROP TABLE IF EXISTS users');
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
            ('Elegant Gold Bangle', 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.', 'bangles', 1100, 10, 'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'),
            ('Dainty Gold Bangle', 'Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.','bangles', 1350, 7, 'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'),
            ('Luxurious Gold Bangle', 'Indulge in opulence with this luxurious gold bangle, weighing a lavish 20 grams. The gleaming gold and ornate detailing create a statement piece that exudes grandeur.', 'bangles', 2250, 15, 'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'),
            ('Classic Gold Bangle','Embody timeless beauty with this classic gold bangle, weighing 15 grams. Its rich gold hue and sophisticated design make it a versatile addition to any jewelry collection.', 'bangles', 1300.50, 10, 'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'),
            ('Chunky Gold Bangle', 'Make a bold statement with this chunky gold bangle, weighing a substantial 30 grams. Its substantial weight and bold design make it a striking accessory that commands attention.', 'bangles', 2720.50, 5,'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'),
            ('Delicate Gold Bangle', 'Radiate elegance with this delicate gold bangle, weighing a charming 8 grams. Its fine craftsmanship and lightweight feel make it a perfect complement to any ensemble.', 'bangles', 850, 7, 'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'),
            ('Vintage Gold Bangle', 'Step into the past with this vintage-inspired gold bangle, weighing 12 grams. The intricate patterns and classic design evoke a sense of nostalgia and sophistication.', 'bangles', 1100, 6,'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'),
            ('Glamorous Gold Bangle', 'Embrace glamour with this stunning gold bangle, weighing 18 grams. The shimmering gold and intricate details create a captivating piece that''s perfect for special occasions.', 'bangles', 1900, 8, 'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'),
            ('Sleek Gold Bangle', 'Embody modern chic with this sleek gold bangle, weighing 7 grams. Its minimalist design and lightweight construction make it a versatile accessory for any modern look.', 'bangles', 1000, 15, 'https://d1ujc5c60bkv1u.cloudfront.net/images/bangle.jpeg'),
            ('Elegant Gold Earrings', 'Elevate your elegance with these elegant gold earrings, each weighing a dainty 5 grams. Their intricate design and lightweight feel make them perfect for adding a touch of sophistication to any outfit.', 'earrings', 350, 10,'https://d1ujc5c60bkv1u.cloudfront.net/images/earrings.jpeg'),
            ('Dazzling Gold Earrings', 'Indulge in luxury with these dazzling diamond earrings, weighing a glamorous 10 grams. The sparkling diamonds and exquisite craftsmanship create a statement piece that captures attention.', 'earrings', 1499.99, 15,'https://d1ujc5c60bkv1u.cloudfront.net/images/earrings.jpeg'),
            ('Charming Gold Earrings', 'Embrace classic charm with these charming pearl earrings, each weighing a delicate 3 grams. The lustrous pearls and timeless design make them an ideal accessory for both casual and formal occasions.', 'earrings', 299.99, 25, 'https://d1ujc5c60bkv1u.cloudfront.net/images/earrings.jpeg'),
            ('Bohemian Gold Hoop Earrings', 'Embrace a bohemian vibe with these hoop earrings, each weighing 7 grams. Their unique design and lightweight construction allow you to effortlessly channel a carefree and chic style.', 'earrings', 199.99, 30,'https://d1ujc5c60bkv1u.cloudfront.net/images/earrings.jpeg'),
            ('Modern Geometric Gold Earrings', 'Embody modernity with these geometric earrings, weighing just 4 grams. Their sleek lines and contemporary design make them a versatile choice for adding a touch of sophistication to any look.', 'earrings', 249.99, 18, 'https://d1ujc5c60bkv1u.cloudfront.net/images/earrings.jpeg'),
            ('Intricate Filigree Gold Earrings', 'Admire the intricate beauty of these filigree earrings, each weighing 6 grams. The delicate details and artistic craftsmanship make them a must-have for lovers of fine jewelry.', 'earrings', 329.99, 12, 'https://d1ujc5c60bkv1u.cloudfront.net/images/earrings.jpeg'),
            ('Statement Tassel Gold Earrings', 'Make a bold statement with these tassel earrings, weighing 8 grams. The playful tassels and eye-catching design add a touch of drama to your ensemble.', 'earrings', 279.99, 22, 'https://d1ujc5c60bkv1u.cloudfront.net/images/earrings.jpeg'),
            ('Minimalist Gold Earrings', 'Embrace simplicity with these minimalist gold earrings, each weighing just 1 gram. Their lightweight feel and clean lines make them a perfect choice for achieving a sleek and modern look.', 'earrings', 149.99, 35, 'https://d1ujc5c60bkv1u.cloudfront.net/images/earrings.jpeg'),
            ('Vintage Stud Gold Earrings', 'Step back in time with these vintage-inspired stud earrings, each weighing a mere 2 grams. Their understated elegance and timeless appeal make them a versatile addition to your jewelry collection.', 'earrings', 199.99, 28,'https://d1ujc5c60bkv1u.cloudfront.net/images/earrings.jpeg'),
            ('Classic Gold Chain Necklace', 'Elevate your style with this classic gold chain necklace, weighing a substantial 15 grams. Its timeless design and durable construction make it a versatile accessory for any occasion.', 'necklaces', 899.99, 10, 'https://d1ujc5c60bkv1u.cloudfront.net/images/necklaces.jpeg'),
            ('Glamorous Gold Pendant Necklace', 'Make a statement with this glamorous pendant necklace, weighing 8 grams. The intricate pendant and shimmering chain create a stunning focal point for your ensemble.', 'necklaces', 599.99, 12, 'https://d1ujc5c60bkv1u.cloudfront.net/images/necklaces.jpeg'),
            ('Chic Gold Choker Necklace', 'Elevate your neckline with this chic gold choker necklace, weighing 6 grams. Its modern design and comfortable fit make it an ideal accessory for both casual and formal looks.', 'necklaces', 449.99, 15, 'https://d1ujc5c60bkv1u.cloudfront.net/images/necklaces.jpeg'),
            ('Boho Beaded Gold Necklace', 'Channel bohemian vibes with this beaded gold necklace, weighing 10 grams. The colorful beads and eclectic design create a playful accessory that complements your free-spirited style.', 'necklaces', 349.99, 20,  'https://d1ujc5c60bkv1u.cloudfront.net/images/necklaces.jpeg'),
            ('Layered Gold Coin Necklace', 'Achieve a layered look with this gold coin necklace, weighing 12 grams. The stacked coins and cascading chains add dimension to your ensemble.', 'necklaces', 799.99, 8, 'https://d1ujc5c60bkv1u.cloudfront.net/images/necklaces.jpeg'),
            ('Elegant Gold Lariat Necklace', 'Embrace elegance with this lariat necklace, weighing 7 grams. The delicate chain and adjustable design allow you to customize its length to suit your style.', 'necklaces', 499.99, 18,  'https://d1ujc5c60bkv1u.cloudfront.net/images/necklaces.jpeg'),
            ('Statement Gold Tassel Necklace', 'Make a bold statement with this tassel necklace, weighing 9 grams. The dramatic tassel and ornate design add drama to your neckline.', 'necklaces', 599.99, 14,  'https://d1ujc5c60bkv1u.cloudfront.net/images/necklaces.jpeg'),
            ('Modern Geometric Gold Necklace', 'Add a touch of modernity with this geometric necklace, weighing 5 grams. The sleek lines and contemporary design make it a versatile addition to your collection.', 'necklaces', 349.99, 22,  'https://d1ujc5c60bkv1u.cloudfront.net/images/necklaces.jpeg'),
            ('Vintage Heart Gold Necklace', 'Capture nostalgia with this vintage-inspired heart necklace, weighing 4 grams. The romantic heart pendant and delicate chain create a sentimental accessory.', 'necklaces', 299.99, 25,  'https://d1ujc5c60bkv1u.cloudfront.net/images/necklaces.jpeg'),
            ('Classic Gold Band Ring', 'Embrace timeless elegance with this classic gold band ring, weighing 6 grams. Its simple yet sophisticated design makes it a versatile accessory for any occasion.', 'rings', 499.99, 15, 'https://d1ujc5c60bkv1u.cloudfront.net/images/rings.jpeg'),
            ('Sparkling Gold Halo Ring', 'Radiate brilliance with this diamond halo ring, weighing 4.5 grams. The dazzling center diamond is surrounded by a halo of smaller diamonds for maximum sparkle.', 'rings', 899.99, 8, 'https://d1ujc5c60bkv1u.cloudfront.net/images/rings.jpeg'),
            ('Delicate Gold Stackable Ring', 'Create your own unique stack with this delicate gold ring, weighing 2 grams. Its slim design allows you to mix and match for a personalized look.', 'rings', 249.99, 20, 'https://d1ujc5c60bkv1u.cloudfront.net/images/rings.jpeg'),
            ('Bold Gemstone Cocktail Ring', 'Make a statement with this bold gemstone cocktail ring, weighing 7.5 grams. The vibrant gemstone and intricate detailing create a dramatic accessory.', 'rings', 599.99, 12, 'https://d1ujc5c60bkv1u.cloudfront.net/images/rings.jpeg'),
            ('Vintage Engraved Gold Ring', 'Capture vintage charm with this engraved gold ring, weighing 5 grams. The intricate engraving and unique design make it a sentimental piece.', 'rings', 349.99, 18, 'https://d1ujc5c60bkv1u.cloudfront.net/images/rings.jpeg'),
            ('Modern Geometric Gold Ring', 'Add a touch of modernity with this geometric gold ring, weighing 3 grams. The sleek lines and contemporary design make it a versatile addition to your collection.', 'rings', 299.99, 22, 'https://d1ujc5c60bkv1u.cloudfront.net/images/rings.jpeg'),
            ('Dainty Gold Heart Ring', 'Express your love with this dainty gold heart ring, weighing 1.5 grams. The sweet heart-shaped design makes it a charming gift for a loved one.', 'rings', 199.99, 25, 'https://d1ujc5c60bkv1u.cloudfront.net/images/rings.jpeg'),
            ('Boho Stacking Gold Ring Set', 'Get the boho look with this stacking ring set, weighing 4 grams in total. The set includes three unique designs that can be worn together or separately.', 'rings', 299.99, 10, 'https://d1ujc5c60bkv1u.cloudfront.net/images/rings.jpeg');`
        )
        await pool.query(`CREATE TABLE users(
          id SERIAL PRIMARY KEY,
          first_name VARCHAR NOT NULL,
          last_name VARCHAR NOT NULL,
          email VARCHAR UNIQUE NOT NULL,
          password VARCHAR NOT NULL
        )`)
        
        await pool.query(`CREATE TABLE carts(
          id SERIAL PRIMARY KEY,
          user_id VARCHAR NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER,
          FOREIGN KEY (product_id) REFERENCES products(id)
        )`)
        await pool.end();
        return response
    }
    catch (error){
        console.error('Error', error)
        return {
            statusCode: 500,
            body: JSON.stringify('Error executing lambda function' + error)
        }
    }
}

module.exports.dbInitLambdaFunction = dbInitLambdaFunction;