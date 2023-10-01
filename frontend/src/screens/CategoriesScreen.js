import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  saveCategory,
  listCategories,
  deleteCategory,
} from "../actions/categoryActions";

function CategoriesScreen(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const st = useSelector((state) => state);
  console.log(st)
  
  const categorySave = useSelector((state) => state.categorySave);
  const {
    loading: loadingSave,
    success: successSave,
    error: errorSave,
  } = categorySave;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = categoryDelete;
  const dispatch = useDispatch();

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
    }
    dispatch(listCategories());
    return () => {
      //
    };
  }, [successSave, successDelete]);

  const openModel = (category) => {
    setModalVisible(true);
    setId(category.category_id);
    setName(category.name);
    setDescription(category.description);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveCategory({
        _id: id,
        name,
        description,
      })
    );
  };
  const deleteHandler = (category) => {
    dispatch(deleteCategory(category.category_id));
  };

  return (
    <div className="content content-margined">
      <div className="category-header">
        <h3>Categories</h3>
        {!modalVisible && (
          <button className="button primary" onClick={() => openModel({})}>
            Create Category
          </button>
        )}
      </div>
      {modalVisible && (
        <div className="form">
          <form onSubmit={submitHandler}>
            <ul className="form-container">
              <li>
                <h2>Create category</h2>
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

      <div className="category-list">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.category_id}>
                <td>{category.category_id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button
                    className="button"
                    onClick={() => openModel(category)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="button"
                    onClick={() => deleteHandler(category)}
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
export default CategoriesScreen;
