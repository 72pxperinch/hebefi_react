import express from "express";
import { isAuth } from "../util.js";
import mysql from "mysql2/promise";

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "hebefi",
};

// Update the route path to "/api/payments"
router.get("/", isAuth, async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const userId = req.user._id;
    const sql = "SELECT * FROM Payments WHERE user_id = ?"; // Update the table name to "Payments"

    const [results] = await connection.execute(sql, [userId]);
    console.log(results);
    res.send(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.end();
    }
  }
});

// Update the route path to "/api/payments/:id"
router.get("/:id", isAuth, async (req, res) => {
  const userID = req.user._id;
  const paymentId = req.params.id; // Update parameter name to "paymentId"
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [results] = await connection.execute(
      "SELECT * FROM Payments WHERE user_id = ? AND payment_id = ?", // Update the table name and query condition
      [userID, paymentId]
    );

    if (results.length === 1) {
      res.send(results[0]);
    } else {
      res.status(404).send({ message: "Payment Not Found." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.end();
    }
  }
});

// Update the route path to "/api/payments/:id"
router.put("/:id", isAuth, async (req, res) => {
  const paymentId = req.params.id;
  const updatedPaymentData = req.body;
  const user = req.user;
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Check if the user is the owner of the payment
    if (user._id === updatedPaymentData.user_id) {
      // Begin a transaction
      await connection.beginTransaction();

      // Update data in Payments table
      const [updatePaymentResult] = await connection.execute(
        "UPDATE Payments SET paymentMethod = ? WHERE payment_id = ?", // Update the table name and columns
        [updatedPaymentData.paymentMethod, paymentId]
      );

      if (updatePaymentResult.affectedRows > 0) {
        // If Payment update is successful, commit the transaction
        await connection.commit();
        res.status(200).send({ message: "Payment Updated", data: updatedPaymentData });
      } else {
        // If Payment update fails, rollback the transaction
        await connection.rollback();
        res.status(404).send({ message: "Payment Not Found" });
      }
    } else {
      res.status(401).send({ message: "Unauthorized to update this payment." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.end();
    }
  }
});

// Update the route path to "/api/payments/:id"
router.delete("/:id", isAuth, async (req, res) => {
  const paymentId = req.params.id;
  const user = req.user;
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Fetch the user_id associated with the payment
    const [paymentData] = await connection.execute(
      "SELECT user_id FROM Payments WHERE payment_id = ?", // Update the table name
      [paymentId]
    );

    if (paymentData.length === 0) {
      res.status(404).send({ message: "Payment Not Found" });
    } else {
      const paymentUserId = paymentData[0].user_id;

      // Check if the user is the owner of the payment
      if (user._id === paymentUserId) {
        // Begin a transaction
        await connection.beginTransaction();

        // Delete from Payments table
        const [deletePaymentResult] = await connection.execute(
          "DELETE FROM Payments WHERE payment_id = ?", // Update the table name
          [paymentId]
        );

        if (deletePaymentResult.affectedRows > 0) {
          // If the payment is deleted successfully, commit the transaction
          await connection.commit();
          res.send({ message: "Payment Deleted" });
        } else {
          // If payment deletion fails, rollback the transaction
          await connection.rollback();
          res.status(404).send({ message: "Payment Not Found" });
        }
      } else {
        res.status(401).send({ message: "Unauthorized to delete this payment." });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.end();
    }
  }
});

// Update the route path to "/api/payments"
router.post("/", isAuth, async (req, res) => {
  const newPayment = req.body;
  const userID = req.user._id; // Get user_id from the authenticated user
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    await connection.beginTransaction();

    const [insertPaymentResult] = await connection.execute(
      "INSERT INTO Payments (paymentMethod, user_id) VALUES (?, ?)", // Update the table name and columns
      [newPayment.paymentMethod, userID]
    );

    const paymentId = insertPaymentResult.insertId;
    await connection.commit();

    newPayment.payment_id = paymentId;
    res.status(201).send({ message: "New Payment Created", data: newPayment });
  } catch (error) {
    console.error("Error:", error);

    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Rollback Error:", rollbackError);
    }

    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.end();
    }
  }
});

export default router;
