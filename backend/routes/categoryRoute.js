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
    const sql = "SELECT * FROM Categories";

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
  const CategoryId = req.params.id;
  let connection;
  try {
    connection = await pool.getConnection();

    const [results] = await connection.query(
      "SELECT * FROM Categories WHERE category_id = ?",
      [CategoryId]
    );

    if (results.length === 1) {
      res.send(results[0]);
    } else {
      res.status(404).send({ message: "Category Not Found." });
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
  const CategoryId = req.params.id;
  const updatedCategoryData = req.body;
  let connection;
  try {
    connection = await pool.getConnection();

    // Begin a transaction
    await connection.beginTransaction();

    // Update data in Categories table
    const [updateCategoryResult] = await connection.execute(
      "UPDATE categories SET name = ?, description = ? WHERE category_id = ?",
      [
        updatedCategoryData.name,
        updatedCategoryData.description,
        CategoryId,
      ]
    );

    if (updateCategoryResult.affectedRows > 0) {
      // If Category update is successful, commit the transaction
      await connection.commit();
      res.status(200).send({ message: "Category Updated", data: updatedCategoryData });
    } else {
      // If Category update fails, rollback the transaction
      await connection.rollback();
      res.status(404).send({ message: "Category Not Found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  const categoryId = req.params.id;
  let connection;
  try {
    connection = await pool.getConnection();

    // Check if there are any products associated with this category
    const [checkProductsResult] = await connection.execute(
      "SELECT COUNT(*) AS productCount FROM Products WHERE category_id = ?",
      [categoryId]
    );

    const productCount = checkProductsResult[0].productCount;

    if (productCount > 0) {
      // If there are products associated with this category, send an error response
      res.status(400).send({ message: "Category has associated products. Cannot delete." });
    } else {
      // Begin a transaction
      await connection.beginTransaction();

      // Delete from categories table
      const [deleteCategoryResult] = await connection.execute(
        "DELETE FROM categories WHERE category_id = ?",
        [categoryId]
      );

      if (deleteCategoryResult.affectedRows > 0) {
        // If the category is deleted successfully, commit the transaction
        await connection.commit();
        res.send({ message: "Category Deleted" });
      } else {
        // If category deletion fails, rollback the transaction
        await connection.rollback();
        res.status(404).send({ message: "Category Not Found" });
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
  const newCategory = req.body;
  let connection;
  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [insertCategoryResult] = await connection.execute(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [
        newCategory.name,
        newCategory.description,
      ]
    );

    const CategoryId = insertCategoryResult.insertId;
    await connection.commit();

    newCategory.category_id = CategoryId;
    res.status(201).send({ message: "New Category Created", data: newCategory });
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
