CREATE DATABASE IF NOT EXISTS shop_db;
USE shop_db;

DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    prod_id INT NOT NULL,
    amount INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (prod_id) REFERENCES products(id)
);

INSERT INTO products (name, description, price, stock) VALUES
('APPLE iPhone 13', '128GB, 5G, Metalic Black', 1000, 5),
('APPLE iPhone 11', '256GB, 5G, Light Blue', 750, 9),
('APPLE iPhone 11', '128GB, 5G, Metalic Black', 799, 12),
('APPLE iPhone SE', '2022, 64GB, 5G, White', 679, 3),
('Samsung Galaxy S21', '128GB, 5G, 6.4", Gray', 879, 7),
('Samsung Galaxy S20', '256GB, 5G, 6.4", Black', 799, 25),
('Samsung Galaxy S22', '256GB, 5G, Dark Green', 1299, 31),
('Sony Xperia 1 IV', ' 256GB, 6,1", Metalic Black', 650, 11),
('Motorola razr 40', ' 256GB 6.9”, 64Mpix, Black', 600, 2);
