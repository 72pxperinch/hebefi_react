import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Select from "react-select";
import {
  saveProduct,
  listProducts,
  deleteProduct,
} from "../actions/productActions";
import { listCategories } from "../actions/categoryActions";
import { listBrands } from "../actions/brandActions";

function ProductsScreen(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [brand_id, setBrand_id] = useState(null);
  const [category_id, setCategory_id] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const productList = useSelector((state) => state.productList);
  const { products } = productList;
  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;
  const brandList = useSelector((state) => state.brandList);
  const { brands } = brandList;
  const productSave = useSelector((state) => state.productSave);
  const {
    loading: loadingSave,
    success: successSave,
    error: errorSave,
  } = productSave;
  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = productDelete;
  const dispatch = useDispatch();

  const [images, setImages] = useState([]); // Updated to store multiple images

  useEffect(() => {
    dispatch(listCategories());
    dispatch(listBrands());
  }, []);

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
    }
    dispatch(listProducts());
    return () => {
      //
    };
  }, [successSave, successDelete]);

  const brandOptions = brands.map((brandOption, index) => ({
    value: brandOption.brand_id,
    label: brandOption.name,
  }));

  const categoryOptions = categories.map((categoryOption, index) => ({
    value: categoryOption.category_id,
    label: categoryOption.name,
  }));

  const handleBrandChange = (selectedOption) => {
    setBrand_id(selectedOption.value);
    setSelectedBrand(selectedOption.name);
  };

  const handleCategoryChange = (selectedOption) => {
    console.log(selectedOption);
    setCategory_id(selectedOption.value);
    setSelectedCategory(selectedOption.name);
    console.log(selectedCategory);
  };

  const openModel = (product) => {
    console.log(product);
    setModalVisible(true);
    setId(product.product_id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImage(product.image);
    setBrand_id(product.brand_id);
    setCategory_id(product.category_id);
    setCountInStock(product.stock_quantity);
    setSelectedBrand(product.brand);
    setSelectedCategory(product.category);

    console.log(selectedCategory);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveProduct({
        _id: id,
        name,
        price,
        images,
        brand_id,
        category_id,
        countInStock,
        description,
      })
    );
  };
  const deleteHandler = (product) => {
    dispatch(deleteProduct(product.product_id));
  };

  // const uploadFileHandler = (e) => {
  //   const file = e.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append("image", file);
  //   setUploading(true);
  //   axios
  //     .post("/api/uploads", bodyFormData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((response) => {
  //       setImage(response.data);
  //       setUploading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setUploading(false);
  //     });
  // };

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    const newImages = [];

    for (const file of files) {
      const bodyFormData = new FormData();
      bodyFormData.append("image", file);

      try {
        const response = await axios.post("/api/uploads", bodyFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        newImages.push(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    setImages(newImages);
  };

  return (
    <div className="content content-margined">
      <div className="product-header">
        <h3>Products</h3>
        <button className="button primary" onClick={() => openModel({})}>
          Create Product
        </button>
      </div>
      {modalVisible && (
        <div className="form">
          <form onSubmit={submitHandler}>
            <ul className="form-container">
              <li>
                <h2>Create Product</h2>
              </li>
              <li>
                {loadingSave && <div>Loading...</div>}
                {errorSave && <div>{errorSave}</div>}
              </li>

              <li>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                ></input>
              </li>
              <li>
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  name="price"
                  value={price}
                  id="price"
                  onChange={(e) => setPrice(e.target.value)}
                  required
                ></input>
              </li>
              <li>
                <label htmlFor="image">Images</label>
                <input
                  type="file"
                  multiple // Allow multiple file selection
                  onChange={uploadFileHandler}
                  required
                ></input>
                {uploading && <div>Uploading...</div>}
                {images.length > 0 && (
                  <ul>
                    {images.map((imageUrl, index) => (
                      <li key={index}>
                        <img src={imageUrl} alt={`Product Image ${index}`} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              {/*<li>
                <label htmlFor="image">Image</label>
                <input
                  type="text"
                  name="image"
                  value={image}
                  id="image"
                  onChange={(e) => setImage(e.target.value)}
                  required
                ></input>
                <input
                  type="file"
                  onChange={uploadFileHandler}
                  required
                ></input>
                {uploading && <div>Uploading...</div>}
              </li> */}
              <li>
                <label htmlFor="brand">Brand</label>
                <Select
                  id="brand"
                  name="brand"
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  options={brandOptions}
                  placeholder="-- Select Brand --"
                  isSearchable={true}
                />
              </li>
              <li>
                <label htmlFor="countInStock">CountInStock</label>
                <input
                  type="number"
                  name="countInStock"
                  value={countInStock}
                  id="countInStock"
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                ></input>
              </li>
              <li>
                <label htmlFor="category">Category</label>
                <Select
                  id="category"
                  name="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  placeholder="-- Select Category --"
                  isSearchable={true}
                />
              </li>
              <li>
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  value={description}
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </li>
              <li>
                <button type="submit" className="button primary">
                  {id ? "Update" : "Create"}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="button secondary"
                >
                  Back
                </button>
              </li>
            </ul>
          </form>
        </div>
      )}

      <div className="product-list">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Brand</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.stock_quantity}</td>
                <td>{product.brand}</td>
                <td>
                  <button className="button" onClick={() => openModel(product)}>
                    Edit
                  </button>{" "}
                  <button
                    className="button"
                    onClick={() => deleteHandler(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ProductsScreen;
