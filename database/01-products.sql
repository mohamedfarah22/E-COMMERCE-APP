-- grant priveliges to admin
GRANT ALL PRIVILEGES ON DATABASE ecommercedatabase TO admin;
-- CREATE TABLE 
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR NOT NULL,
    product_description TEXT NOT NULL,
    category VARCHAR NOT NULL,
    price FLOAT NOT NULL,
    available_quantity INTEGER,
    image_url VARCHAR
);
--create bangle products
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Elegant Gold Bangle','Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.', 'bangles', 1100, 10, 'http://localhost:8080/images/bangle.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Dainty Gold Bangle', 'Embrace subtle luxury with this dainty gold bangle, weighing just 15 grams. Its lightweight charm and delicate craftsmanship ensure it''s perfect for everyday wear.','bangles', 1350, 7, 'http://localhost:8080/images/bangle.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Luxurious Gold Bangle', 'Indulge in opulence with this luxurious gold bangle, weighing a lavish 20 grams. The gleaming gold and ornate detailing create a statement piece that exudes grandeur.', 'bangles', 2250, 15, 'http://localhost:8080/images/bangle.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Classic Gold Bangle','Embody timeless beauty with this classic gold bangle, weighing 15 grams. Its rich gold hue and sophisticated design make it a versatile addition to any jewelry collection.', 'bangles', 1300.50, 10, 'http://localhost:8080/images/bangle.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Chunky Gold Bangle', 'Make a bold statement with this chunky gold bangle, weighing a substantial 30 grams. Its substantial weight and bold design make it a striking accessory that commands attention.', 'bangles', 2720.50, 5, 'http://localhost:8080/images/bangle.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Delicate Gold Bangle', 'Radiate elegance with this delicate gold bangle, weighing a charming 8 grams. Its fine craftsmanship and lightweight feel make it a perfect complement to any ensemble.', 'bangles', 850, 7, 'http://localhost:8080/images/bangle.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Vintage Gold Bangle', 'Step into the past with this vintage-inspired gold bangle, weighing 12 grams. The intricate patterns and classic design evoke a sense of nostalgia and sophistication.', 'bangles', 1100, 6, 'http://localhost:8080/images/bangle.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Glamorous Gold Bangle', 'Embrace glamour with this stunning gold bangle, weighing 18 grams. The shimmering gold and intricate details create a captivating piece that''s perfect for special occasions.', 'bangles', 1900, 8, 'http://localhost:8080/images/bangle.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Sleek Gold Bangle', 'Embody modern chic with this sleek gold bangle, weighing 7 grams. Its minimalist design and lightweight construction make it a versatile accessory for any modern look.', 'bangles', 1000, 15, 'http://localhost:8080/images/bangle.jpeg');


--create earring products
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Elegant Gold Earrings', 'Elevate your elegance with these elegant gold earrings, each weighing a dainty 5 grams. Their intricate design and lightweight feel make them perfect for adding a touch of sophistication to any outfit.', 'earrings', 350, 10, 'http://localhost:8080/images/earrings.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Dazzling Gold Earrings', 'Indulge in luxury with these dazzling diamond earrings, weighing a glamorous 10 grams. The sparkling diamonds and exquisite craftsmanship create a statement piece that captures attention.', 'earrings', 1499.99, 15, 'http://localhost:8080/images/earrings.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Charming Gold Earrings', 'Embrace classic charm with these charming pearl earrings, each weighing a delicate 3 grams. The lustrous pearls and timeless design make them an ideal accessory for both casual and formal occasions.', 'earrings', 299.99, 25, 'http://localhost:8080/images/earrings.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Bohemian Gold Hoop Earrings', 'Embrace a bohemian vibe with these hoop earrings, each weighing 7 grams. Their unique design and lightweight construction allow you to effortlessly channel a carefree and chic style.', 'earrings', 199.99, 30, 'http://localhost:8080/images/earrings.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Modern Geometric Gold Earrings', 'Embody modernity with these geometric earrings, weighing just 4 grams. Their sleek lines and contemporary design make them a versatile choice for adding a touch of sophistication to any look.', 'earrings', 249.99, 18, 'http://localhost:8080/images/earrings.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Intricate Filigree Gold Earrings', 'Admire the intricate beauty of these filigree earrings, each weighing 6 grams. The delicate details and artistic craftsmanship make them a must-have for lovers of fine jewelry.', 'earrings', 329.99, 12, 'http://localhost:8080/images/earrings.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Statement Tassel Gold Earrings', 'Make a bold statement with these tassel earrings, weighing 8 grams. The playful tassels and eye-catching design add a touch of drama to your ensemble.', 'earrings', 279.99, 22, 'http://localhost:8080/images/earrings.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Vintage Stud Gold Earrings', 'Step back in time with these vintage-inspired stud earrings, each weighing a mere 2 grams. Their understated elegance and timeless appeal make them a versatile addition to your jewelry collection.', 'earrings', 199.99, 28, 'http://localhost:8080/images/earrings.jpeg');

INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Minimalist Gold Earrings', 'Embrace simplicity with these minimalist gold earrings, each weighing just 1 gram. Their lightweight feel and clean lines make them a perfect choice for achieving a sleek and modern look.', 'earrings', 149.99, 35, 'http://localhost:8080/images/earrings.jpeg');

--create necklaces products

-- Classic Gold Chain Necklace - 15g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Classic Gold Chain Necklace', 'Elevate your style with this classic gold chain necklace, weighing a substantial 15 grams. Its timeless design and durable construction make it a versatile accessory for any occasion.', 'necklaces', 899.99, 10, 'http://localhost:8080/images/necklaces.jpeg');

-- Glamorous Gold Pendant Necklace - 8g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Glamorous Gold Pendant Necklace', 'Make a statement with this glamorous pendant necklace, weighing 8 grams. The intricate pendant and shimmering chain create a stunning focal point for your ensemble.', 'necklaces', 599.99, 12, 'http://localhost:8080/images/necklaces.jpeg');

-- Chic Gold Choker Necklace - 6g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Chic Gold Choker Necklace', 'Elevate your neckline with this chic gold choker necklace, weighing 6 grams. Its modern design and comfortable fit make it an ideal accessory for both casual and formal looks.', 'necklaces', 449.99, 15, 'http://localhost:8080/images/necklaces.jpeg');

-- Boho Beaded Gold Necklace - 10g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Boho Beaded Gold Necklace', 'Channel bohemian vibes with this beaded gold necklace, weighing 10 grams. The colorful beads and eclectic design create a playful accessory that complements your free-spirited style.', 'necklaces', 349.99, 20, 'http://localhost:8080/images/necklaces.jpeg');

-- Layered Gold Coin Necklace - 12g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Layered Gold Coin Necklace', 'Achieve a layered look with this gold coin necklace, weighing 12 grams. The stacked coins and cascading chains add dimension to your ensemble.', 'necklaces', 799.99, 8, 'http://localhost:8080/images/necklaces.jpeg');

-- Elegant Gold Lariat Necklace - 7g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Elegant Gold Lariat Necklace', 'Embrace elegance with this lariat necklace, weighing 7 grams. The delicate chain and adjustable design allow you to customize its length to suit your style.', 'necklaces', 499.99, 18, 'http://localhost:8080/images/necklaces.jpeg');

-- Statement Gold Tassel Necklace - 9g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Statement Gold Tassel Necklace', 'Make a bold statement with this tassel necklace, weighing 9 grams. The dramatic tassel and ornate design add drama to your neckline.', 'necklaces', 599.99, 14, 'http://localhost:8080/images/necklaces.jpeg');

-- Modern Geometric Gold Necklace - 5g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Modern Geometric Gold Necklace', 'Add a touch of modernity with this geometric necklace, weighing 5 grams. The sleek lines and contemporary design make it a versatile addition to your collection.', 'necklaces', 349.99, 22, 'http://localhost:8080/images/necklaces.jpeg');

-- Vintage Heart Gold Necklace - 4g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Vintage Heart Gold Necklace', 'Capture nostalgia with this vintage-inspired heart necklace, weighing 4 grams. The romantic heart pendant and delicate chain create a sentimental accessory.', 'necklaces', 299.99, 25, 'http://localhost:8080/images/necklaces.jpeg');


--create rings products
-- Classic Gold Band Ring - 6g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Classic Gold Band Ring', 'Embrace timeless elegance with this classic gold band ring, weighing 6 grams. Its simple yet sophisticated design makes it a versatile accessory for any occasion.', 'rings', 499.99, 15, 'http://localhost:8080/images/rings.jpeg');

-- Sparkling Diamond Halo Ring - 4.5g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Sparkling Gold Halo Ring', 'Radiate brilliance with this diamond halo ring, weighing 4.5 grams. The dazzling center diamond is surrounded by a halo of smaller diamonds for maximum sparkle.', 'rings', 899.99, 8, 'http://localhost:8080/images/rings.jpeg');

-- Delicate Gold Stackable Ring - 2g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Delicate Gold Stackable Ring', 'Create your own unique stack with this delicate gold ring, weighing 2 grams. Its slim design allows you to mix and match for a personalized look.', 'rings', 249.99, 20, 'http://localhost:8080/images/rings.jpeg');

-- Bold Gemstone Cocktail Ring - 7.5g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Bold Gemstone Cocktail Ring', 'Make a statement with this bold gemstone cocktail ring, weighing 7.5 grams. The vibrant gemstone and intricate detailing create a dramatic accessory.', 'rings', 599.99, 12, 'http://localhost:8080/images/rings.jpeg');

-- Vintage Engraved Gold Ring - 5g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Vintage Engraved Gold Ring', 'Capture vintage charm with this engraved gold ring, weighing 5 grams. The intricate engraving and unique design make it a sentimental piece.', 'rings', 349.99, 18, 'http://localhost:8080/images/rings.jpeg');

-- Modern Geometric Gold Ring - 3g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Modern Geometric Gold Ring', 'Add a touch of modernity with this geometric gold ring, weighing 3 grams. The sleek lines and contemporary design make it a versatile addition to your collection.', 'rings', 299.99, 22, 'http://localhost:8080/images/rings.jpeg');

-- Dainty Gold Heart Ring - 1.5g
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Dainty Gold Heart Ring', 'Express your love with this dainty gold heart ring, weighing 1.5 grams. The sweet heart-shaped design makes it a charming gift for a loved one.', 'rings', 199.99, 25, 'http://localhost:8080/images/rings.jpeg');

-- Boho Stacking Gold Ring Set - 4g (Set of 3)
INSERT INTO products (product_name, product_description, category, price, available_quantity, image_url)
VALUES ('Boho Stacking Gold Ring Set', 'Get the boho look with this stacking ring set, weighing 4 grams in total. The set includes three unique designs that can be worn together or separately.', 'rings', 299.99, 10, 'http://localhost:8080/images/rings.jpeg');
