import express from "express";
import { isAuth, isAdmin } from "../util.js";
import mysql from "mysql2/promise";

const router = express.Router();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "hebefi",
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

router.get("/", isAuth, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const userId = req.user._id; // Get user_id from the authenticated user
    const sql = "SELECT * FROM Addresses WHERE user_id = ?"; // Add a WHERE clause to filter by user_id

    const [results] = await connection.query(sql, [userId]); // Pass userId as a parameter
    console.log(results);
    res.send(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.get("/:id", isAuth, async (req, res) => {
  const userID = req.user._id;
  let connection;
  try {
    connection = await pool.getConnection();

    const [results] = await connection.query(
      "SELECT * FROM Addresses WHERE user_id = ?",
      [userID]
    );

    if (results.length === 1) {
      res.send(results[0]);
    } else {
      res.status(404).send({ message: "Address Not Found." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.put("/:id", isAuth, async (req, res) => {
  const addressId = req.params.id;
  const updatedAddressData = req.body;
  const user = req.user; // Get the authenticated user
  let connection;
  console.log(user._id)
  
  try {
    connection = await pool.getConnection();

    // Check if the user is an admin or the owner of the address
    if (user._id === updatedAddressData.user_id) {
      // Begin a transaction
      await connection.beginTransaction();

      // Update data in Addresses table
      const [updateAddressResult] = await connection.execute(
        "UPDATE Addresses SET address = ?, city = ?, postalCode = ?, country = ? WHERE address_id = ?",
        [
          updatedAddressData.address,
          updatedAddressData.city,
          updatedAddressData.postalCode,
          updatedAddressData.country,
          addressId,
        ]
      );

      if (updateAddressResult.affectedRows > 0) {
        // If Address update is successful, commit the transaction
        await connection.commit();
        res.status(200).send({ message: "Address Updated", data: updatedAddressData });
      } else {
        // If Address update fails, rollback the transaction
        await connection.rollback();
        res.status(404).send({ message: "Address Not Found" });
      }
    } else {
      res.status(401).send({ message: "Unauthorized to update this address." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.delete("/:id", isAuth, async (req, res) => {
  const addressId = req.params.id;
  const user = req.user; // Get the authenticated user
  let connection;
  
  try {
    connection = await pool.getConnection();

    // Fetch the user_id associated with the address
    const [addressData] = await connection.execute(
      "SELECT user_id FROM Addresses WHERE address_id = ?",
      [addressId]
    );

    if (addressData.length === 0) {
      res.status(404).send({ message: "Address Not Found" });
    } else {
      const addressUserId = addressData[0].user_id;

      // Check if the user is an admin or the owner of the address
      if (user._id === addressUserId) {
        // Begin a transaction
        await connection.beginTransaction();

        // Delete from Addresses table
        const [deleteAddressResult] = await connection.execute(
          "DELETE FROM Addresses WHERE address_id = ?",
          [addressId]
        );

        if (deleteAddressResult.affectedRows > 0) {
          // If the address is deleted successfully, commit the transaction
          await connection.commit();
          res.send({ message: "Address Deleted" });
        } else {
          // If address deletion fails, rollback the transaction
          await connection.rollback();
          res.status(404).send({ message: "Address Not Found" });
        }
      } else {
        res.status(401).send({ message: "Unauthorized to delete this address." });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.post("/", isAuth, async (req, res) => {
  const newAddress = req.body;
  const userID = req.user._id;
  console.log(newAddress);
  console.log(userID);
  let connection;
  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [insertAddressResult] = await connection.execute(
      "INSERT INTO Addresses (address, user_id, city, postalCode, country) VALUES (?, ?, ?, ?, ?)",
      [
        newAddress.address,
        userID,
        newAddress.city,
        newAddress.postalCode,
        newAddress.country,
      ]
    );

    const addressId = insertAddressResult.insertId;
    await connection.commit();

    newAddress.address_id = addressId;
    res.status(201).send({ message: "New Address Created", data: newAddress });
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
      connection.release();
    }
  }
});

export default router;