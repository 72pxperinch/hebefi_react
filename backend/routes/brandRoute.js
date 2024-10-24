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

router.get("/", async (req, res) => {

  let connection;
  try {
    connection = await pool.getConnection();
    const sql = "SELECT * FROM Brands";

    const [results] = await connection.query(sql);
    console.log(results)
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

router.get("/:id", async (req, res) => {
  const BrandId = req.params.id;
  let connection;
  try {
    connection = await pool.getConnection();

    const [results] = await connection.query(
      "SELECT * FROM Brands WHERE brand_id = ?",
      [BrandId]
    );

    if (results.length === 1) {
      res.send(results[0]);
    } else {
      res.status(404).send({ message: "Brand Not Found." });
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


router.put("/:id", isAuth, isAdmin, async (req, res) => {
  const BrandId = req.params.id;
  const updatedBrandData = req.body;
  let connection;
  try {
    connection = await pool.getConnection();

    // Begin a transaction
    await connection.beginTransaction();

    // Update data in Brands table
    const [updateBrandResult] = await connection.execute(
      "UPDATE Brands SET name = ?, description = ? WHERE brand_id = ?",
      [
        updatedBrandData.name,
        updatedBrandData.description,
        BrandId,
      ]
    );

    if (updateBrandResult.affectedRows > 0) {
      // If Brand update is successful, commit the transaction
      await connection.commit();
      res.status(200).send({ message: "Brand Updated", data: updatedBrandData });
    } else {
      // If Brand update fails, rollback the transaction
      await connection.rollback();
      res.status(404).send({ message: "Brand Not Found" });
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
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  const brandId = req.params.id;
  let connection;
  try {
    connection = await pool.getConnection();

    // Check if there are any products associated with this brand
    const [checkProductsResult] = await connection.execute(
      "SELECT COUNT(*) AS productCount FROM Products WHERE brand_id = ?",
      [brandId]
    );

    const productCount = checkProductsResult[0].productCount;

    if (productCount > 0) {
      // If there are products associated with this brand, send an error response
      res.status(400).send({ message: "Brand has associated products. Cannot delete." });
    } else {
      // Begin a transaction
      await connection.beginTransaction();

      // Delete from Brands table
      const [deleteBrandResult] = await connection.execute(
        "DELETE FROM Brands WHERE brand_id = ?",
        [brandId]
      );

      if (deleteBrandResult.affectedRows > 0) {
        // If the brand is deleted successfully, commit the transaction
        await connection.commit();
        res.send({ message: "Brand Deleted" });
      } else {
        // If brand deletion fails, rollback the transaction
        await connection.rollback();
        res.status(404).send({ message: "Brand Not Found" });
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



router.post("/", isAuth, isAdmin, async (req, res) => {
  const newBrand = req.body;
  let connection;
  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [insertBrandResult] = await connection.execute(
      "INSERT INTO Brands (name, description) VALUES (?, ?)",
      [
        newBrand.name,
        newBrand.description,
      ]
    );

    const BrandId = insertBrandResult.insertId;
    await connection.commit();

    newBrand.brand_id = BrandId;
    res.status(201).send({ message: "New Brand Created", data: newBrand });
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
