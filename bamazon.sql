DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(20) NOT NULL,
  price DECIMAL(10, 2) NULL,
  stock_quantity INTEGER(10) NULL,  
  product_sales DECIMAL(10, 2) NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(20) NOT NULL, 
  over_head_costs DECIMAL(10, 2) NULL,   
  PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("CRESSI SUB Gara 2000", "Sports", 139.95, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("SPORASUB Piranha Mask", "Sports", 88.00, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("HOYT Buffalo Bow Recurve", "Sports", 350.00, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("BERETTA APX .40S&W Firearm", "Sports", 575.00, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("HK P30L 9mm Firearm", "Sports", 1233.33, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("EMARTH Spotting Scope Monocular", "Travel Gear", 59.99, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("VASQUE Mantra 2.0 Gore-Tex Hiking Boots", "Travel Gear", 112.46, 7);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("EVECASE Large DSLR Camera/Laptop Travel Backpack", "Travel Gear", 67.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("SONY Playstation VR Headset", "Electronics", 350.09, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("INTEL External SSD 2.5in 800GB", "Electronics", 461.99, 3);