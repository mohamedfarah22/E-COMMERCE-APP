DROP TABLE IF EXISTS carts;

CREATE TABLE carts(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

--create dummy cart data--
INSERT INTO carts(user_id, product_id, quantity) VALUES (1,1, 2);