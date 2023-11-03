import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  saveBrand,
  listBrands,
  deleteBrand,
} from "../actions/brandActions";

function BrandsScreen(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const brandList = useSelector((state) => state.brandList);
  const { brands } = brandList;
  const st = useSelector((state) => state)
  console.log(st)

  const brandSave = useSelector((state) => state.brandSave);
  const {
    loading: loadingSave,
    success: successSave,
    error: errorSave,
  } = brandSave;

  const brandDelete = useSelector((state) => state.brandDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = brandDelete;
  const dispatch = useDispatch();

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
    }
    dispatch(listBrands());
    return () => {
      //
    };
  }, [successSave, successDelete]);

  const openModel = (brand) => {
    setModalVisible(true);
    setId(brand.brand_id);
    setName(brand.name);
    setDescription(brand.description);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveBrand({
        _id: id,
        name,
        description,
      })
    );
  };
  const deleteHandler = (brand) => {
    dispatch(deleteBrand(brand.brand_id));
  };

  return (
    <div className="content content-margined">
      <div className="category-header">
        <h3>Brands</h3>
        {!modalVisible && (
          <button className="button primary" onClick={() => openModel({})}>
            Create Brand
          </button>
        )}
      </div>
      {modalVisible && (
        <div className="form">
          <form onSubmit={submitHandler}>
            <ul className="form-container">
              <li>
                <h2>Create Brand</h2>
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
            {brands.map((brand) => (
              <tr key={brand.brand_id}>
                <td>{brand.brand_id}</td>
                <td>{brand.name}</td>
                <td>{brand.description}</td>
                <td>
                  <button
                    className="button"
                    onClick={() => openModel(brand)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="button"
                    onClick={() => deleteHandler(brand)}
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
export default BrandsScreen;
