DROP TABLE IF EXISTS carts;

CREATE TABLE carts(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

--create dummy cart data--
INSERT INTO carts(user_id, product_id, quantity) VALUES (1,1, 2);