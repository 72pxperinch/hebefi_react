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
  const category = req.query.category || "";
  const searchKeyword = req.query.searchKeyword || "";
  const sortOrder = req.query.sortOrder || "newest";

  let connection;
  try {
    connection = await pool.getConnection();

    let sql = `
      SELECT P.*, GROUP_CONCAT(PI.image_url) AS images, B.name AS brand, C.name AS category
      FROM Products P
      LEFT JOIN Product_Images PI ON P.product_id = PI.product_id
      LEFT JOIN Brands B ON P.brand_id = B.brand_id
      LEFT JOIN Categories C ON P.category_id = C.category_id
    `;
    const conditions = [];

    if (category) {
      conditions.push(`C.name = ?`);
    }

    if (searchKeyword) {
      conditions.push(`P.name LIKE ?`);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    if (sortOrder) {
      sql += ` GROUP BY P.product_id ORDER BY P.price ${
        sortOrder === "lowest" ? "ASC" : "DESC"
      }`;
    }

    const searchKeywordParam = `%${searchKeyword}%`;

    const [results] = await connection.query(sql, [
      category,
      searchKeywordParam,
    ]);

    // Convert the comma-separated images string to an array
    const productsWithImages = results.map((product) => ({
      ...product,
      images: product.images ? product.images.split(",") : [],
    }));

    res.send(productsWithImages);
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
  const productId = req.params.id;
  let connection;
  try {
    connection = await pool.getConnection();

    const [results] = await connection.query(
      "SELECT P.*, GROUP_CONCAT(PI.image_url) AS images FROM Products P LEFT JOIN Product_Images PI ON P.product_id = PI.product_id WHERE P.product_id = ?",
      [productId]
    );

    if (results.length === 1) {
      const product = results[0];
      console.log(product);
      // Convert the comma-separated images string to an array
      product.images = product.images ? product.images.split(",") : [];
      res.send(product);
      console.log(product);
    } else {
      res.status(404).send({ message: "Product Not Found." });
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
  const productId = req.params.id;
  const updatedProductData = req.body;
  const images = updatedProductData.images; // New images to be added
  let connection;
  try {
    connection = await pool.getConnection();

    // Begin a transaction
    await connection.beginTransaction();

    // Remove existing images for the product
    await connection.execute(
      "DELETE FROM Product_Images WHERE product_id = ?",
      [productId]
    );

    // Insert new images into Product_Images table
    if (images && images.length > 0) {
      for (const imageUrl of images) {
        await connection.execute(
          "INSERT INTO Product_Images (product_id, image_url) VALUES (?, ?)",
          [productId, imageUrl]
        );
      }
    }

    // Update data in Products table
    const [updateProductResult] = await connection.execute(
      "UPDATE Products SET name = ?, price = ?, brand_id = ?, category_id = ?, stock_quantity = ?, description = ? WHERE product_id = ?",
      [
        updatedProductData.name,
        updatedProductData.price,
        updatedProductData.brand_id,
        updatedProductData.category_id,
        updatedProductData.countInStock,
        updatedProductData.description,
        productId,
      ]
    );

    if (updateProductResult.affectedRows > 0) {
      // If product update is successful, commit the transaction
      await connection.commit();
      res.status(200).send({ message: "Product Updated", data: updatedProductData });
    } else {
      // If product update fails, rollback the transaction
      await connection.rollback();
      res.status(404).send({ message: "Product Not Found" });
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
  const productId = req.params.id;
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Begin a transaction
    await connection.beginTransaction();

    // Delete from Product_Images table
    const [deleteImageResult] = await connection.execute(
      "DELETE FROM Product_Images WHERE product_id = ?",
      [productId]
    );

    if (deleteImageResult.affectedRows > 0) {
      // If images are deleted successfully, proceed to delete from Products table
      const [deleteProductResult] = await connection.execute(
        "DELETE FROM Products WHERE product_id = ?",
        [productId]
      );

      if (deleteProductResult.affectedRows > 0) {
        // If the product is deleted successfully, commit the transaction
        await connection.commit();
        res.send({ message: "Product Deleted" });
      } else {
        // If product deletion fails, rollback the transaction
        await connection.rollback();
        res.status(404).send({ message: "Product Not Found" });
      }
    } else {
      // If image deletion fails, rollback the transaction
      await connection.rollback();
      res.status(404).send({ message: "Product Images Not Found" });
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
  const newProduct = req.body;
  console.log(newProduct);
  let connection;
  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [insertProductResult] = await connection.execute(
      "INSERT INTO Products (name, price, brand_id, category_id, stock_quantity, description) VALUES (?, ?, ?, ?, ?, ?)",
      [
        newProduct.name,
        newProduct.price,
        newProduct.brand_id,
        newProduct.category_id,
        newProduct.countInStock,
        newProduct.description,
      ]
    );

    const productId = insertProductResult.insertId;

    if (!productId) {
      throw new Error("Error in Creating Product.");
    }

    // Iterate through the images array and insert each image into the Product_Images table
    for (const imageUrl of newProduct.images) {
      const [insertImageResult] = await connection.execute(
        "INSERT INTO Product_Images (product_id, image_url) VALUES (?, ?)",
        [productId, imageUrl]
      );

      if (!insertImageResult.affectedRows) {
        throw new Error("Error in Creating Product Image.");
      }
    }

    await connection.commit();

    newProduct.product_id = productId;
    res.status(201).send({ message: "New Product Created", data: newProduct });
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
