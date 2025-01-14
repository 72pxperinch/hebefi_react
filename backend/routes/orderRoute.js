import express from "express";
import mysql from "mysql2/promise";
import { isAdmin, isAuth } from "../util.js";

const router = express.Router();

// Create a MySQL database connection

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "hebefi",
};

const pool = mysql.createPool(dbConfig);

router.get("/", isAuth, isAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT * FROM Orders");
    connection.release();
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/mine", isAuth, async (req, res) => {
  // Fetch orders for the currently authenticated user
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM Orders WHERE user_id = ?",
      [req.user._id]
    );
    connection.release();
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// router.get("/:id", isAuth, async (req, res) => {
//   // Fetch a specific order by ID with related address and payment info
//   try {
//     const connection = await pool.getConnection();
//     const [rows] = await connection.execute(
//       `
//       SELECT o.*, a.*, p.*
//       FROM Orders AS o
//       LEFT JOIN Addresses AS a ON o.address_id = a.address_id
//       LEFT JOIN Payments AS p ON o.payment_id = p.payment_id
//       WHERE o.order_id = ?
//       `,
//       [req.params.id]
//     );
//     connection.release();

//     if (rows.length > 0) {
//       res.send(rows[0]);
//       console.log(rows[0]);
//     } else {
//       res.status(404).send("Order Not Found.");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

router.get("/:id", isAuth, async (req, res) => {
  // Fetch a specific order by ID with related address, payment info, and product details
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `
      SELECT o.*, a.*, p.*, (
        SELECT JSON_ARRAYAGG(JSON_OBJECT(
          'product_id', oi.product_id,
          'qty', oi.qty,
          'name', (
            SELECT name FROM Products WHERE product_id = oi.product_id
          ),
          'price', (
            SELECT price FROM Products WHERE product_id = oi.product_id
          ),
          'images', (SELECT GROUP_CONCAT(image_url) FROM Product_Images WHERE product_id = oi.product_id
          )
        ))
        FROM OrderItems AS oi
        WHERE oi.order_id = o.order_id
      ) AS orderItems
      FROM Orders AS o
      LEFT JOIN Addresses AS a ON o.address_id = a.address_id
      LEFT JOIN Payments AS p ON o.payment_id = p.payment_id
      WHERE o.order_id = ?
      `,
      [req.params.id]
    );
    connection.release();

    if (rows.length > 0) {
      res.send(rows[0]);
      console.log(rows[0]);
    } else {
      res.status(404).send("Order Not Found.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  // Delete a specific order by ID
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "DELETE FROM Orders WHERE order_id = ?",
      [req.params.id]
    );
    connection.release();

    if (result.affectedRows > 0) {
      res.send({ message: "Order Deleted" });
    } else {
      res.status(404).send("Order Not Found.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", isAuth, async (req, res) => {
  // Create a new order
  const user_id = req.user._id;
  const data = req.body;
  const {
    orderItems,
    address_id,
    payment_id,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;
console.log(data)
  try {
    const connection = await pool.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Insert the order into the Orders table
    const [orderResult] = await connection.execute(
      "INSERT INTO Orders (user_id, itemsPrice, shippingPrice, taxPrice, totalPrice) VALUES (?, ?, ?, ?, ?)",
      [
        user_id,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      ]
    );

    data.order_id = orderResult.insertId;

    if (orderResult.affectedRows > 0) {
      // Iterate through orderItems and insert each item into the Cart_Items table
      for (const orderItem of orderItems) {
        const { product, qty } = orderItem;
        const [cartResult] = await connection.execute(
          "INSERT INTO OrderItems (product_id, qty, order_id) VALUES (?, ?, ?)",
          [product, qty, data.order_id]
        );

        if (cartResult.affectedRows <= 0) {
          // If an item insertion fails, rollback the transaction and return an error response
          await connection.rollback();
          connection.release();
          return res.status(500).send("Cart Item Creation Failed.");
        }
      }

      // Commit the transaction if all item insertions are successful
      await connection.commit();
      connection.release();
      res.status(201).send({ message: "New Order Created", data: data });
    } else {
      // If the order insertion fails, return an error response
      await connection.rollback();
      connection.release();
      res.status(500).send("Order Creation Failed.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/address:id", isAuth, async (req, res) => {
  const user_id = req.user._id;
  const order_id = req.params.id; // Extract order_id from the URL parameters
  const updatedData = req.body; // New data to update the order
console.log("updated dta: " + updatedData)
  try {
    const connection = await pool.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Check if the order belongs to the logged-in user
    const [orderResult] = await connection.execute(
      "SELECT * FROM Orders WHERE order_id = ? AND user_id = ?",
      [order_id, user_id]
    );

    if (orderResult.length === 0) {
      // If the order does not exist or does not belong to the user, return an error
      await connection.rollback();
      connection.release();
      return res.status(404).send("Order not found or unauthorized.");
    }

    // Update the order in the Orders table
    const [updateResult] = await connection.execute(
      "UPDATE Orders SET address_id = ? WHERE order_id = ?",
      [updatedData.address, order_id]
    );

    if (updateResult.affectedRows > 0) {
      // If the order is successfully updated, commit the transaction
      await connection.commit();
      connection.release();
      res.status(200).send({ message: "Order updated successfully" , data:{order_id:order_id,}});
    } else {
      // If the update operation fails, rollback the transaction and return an error response
      await connection.rollback();
      connection.release();
      res.status(500).send("Order update failed.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/payment:id", isAuth, async (req, res) => {
  const user_id = req.user._id;
  const order_id = req.params.id; // Extract order_id from the URL parameters
  const updatedData = req.body; // New data to update the order
console.log(updatedData)
  try {
    const connection = await pool.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Check if the order belongs to the logged-in user
    const [orderResult] = await connection.execute(
      "SELECT * FROM Orders WHERE order_id = ? AND user_id = ?",
      [order_id, user_id]
    );

    if (orderResult.length === 0) {
      // If the order does not exist or does not belong to the user, return an error
      await connection.rollback();
      connection.release();
      return res.status(404).send("Order not found or unauthorized.");
    }

    // Update the order in the Orders table
    const [updateResult] = await connection.execute(
      "UPDATE Orders SET payment_id = ? WHERE order_id = ?",
      [updatedData.payment, order_id]
    );

    if (updateResult.affectedRows > 0) {
      // If the order is successfully updated, commit the transaction
      await connection.commit();
      connection.release();
      res.status(200).send({ message: "Order updated successfully", data:{order_id:order_id,} });
    } else {
      // If the update operation fails, rollback the transaction and return an error response
      await connection.rollback();
      connection.release();
      res.status(500).send("Order update failed.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.put("/:id/pay", isAuth, async (req, res) => {
  // Update order payment status
  const { payerID, orderID, paymentID } = req.body;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      "UPDATE Orders SET isPaid = ?, paidAt = ?, paymentMethod = ?, payerID = ?, orderID = ?, paymentID = ? WHERE order_id = ?",
      [true, new Date(), "paypal", payerID, orderID, paymentID, req.params.id]
    );

    connection.release();

    if (result.affectedRows > 0) {
      res.send({ message: "Order Paid." });
    } else {
      res.status(404).send("Order Not Found.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
