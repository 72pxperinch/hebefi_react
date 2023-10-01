-- Create the 'hebefi' schema
CREATE SCHEMA hebefi;

-- Use the 'hebefi' schema
USE hebefi;

-- Create Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    status INT,
    PRIMARY KEY (user_id)
    -- Add other user-related columns here
);

-- Create Categories Table
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status INT,
    PRIMARY KEY (category_id)
);

-- Create Products Table (with Historical Tracking)
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT,
    name VARCHAR(255)  NOT NULL,
    description TEXT  NOT NULL,
    price DECIMAL(10, 2)  NOT NULL,
    stock_quantity INT  NOT NULL,
    category_id INT,
    start_date DATETIME,
    status INT,
    end_date DATETIME,
    PRIMARY KEY (product_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Product_Images (
    image_id INT AUTO_INCREMENT,
    product_id INT  NOT NULL,
    image_url VARCHAR(255)  NOT NULL,  -- Store image URLs or file paths
    upload_date DATETIME,
    status INT,
    PRIMARY KEY (image_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Create Reviews Table (with Historical Tracking)
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    timestamp DATETIME NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    status INT,
    PRIMARY KEY (review_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Orders Table (with Historical Tracking)
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_date DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    status INT,
    PRIMARY KEY (order_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Create Order_Items Table
CREATE TABLE Order_Items (
    order_item_id INT AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT,
    status INT,
    subtotal DECIMAL(10, 2),
    PRIMARY KEY (order_item_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Create Shopping_Cart Table (with Historical Tracking)
CREATE TABLE Shopping_Cart (
    cart_id INT AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity INT,
    status INT,
    start_date DATETIME,
    end_date DATETIME,
    PRIMARY KEY (cart_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Create Wishlist Table
CREATE TABLE Wishlist (
    wishlist_id INT AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    added_date DATETIME,
    PRIMARY KEY (wishlist_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);
