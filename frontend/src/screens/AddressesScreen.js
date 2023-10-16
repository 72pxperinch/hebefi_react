import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  saveAddress,
  listAddress,
  deleteAddress,
} from "../actions/addressActions";

function AddressesScreen(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [user_id, setUser_id] = useState("");

  const addressList = useSelector((state) => state.addressList);
  const { addresses } = addressList;

  const addressSave = useSelector((state) => state.addressSave);
  const {
    loading: loadingSave,
    success: successSave,
    error: errorSave,
  } = addressSave;

  const addressDelete = useSelector((state) => state.addressDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = addressDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listAddress());
  }, []);

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
    }
    dispatch(listAddress());
  }, [successSave, successDelete]);

  const openModel = (address) => {
    setModalVisible(true);
    setId(address.address_id);
    setAddress(address.address);
    setCity(address.city);
    setPostalCode(address.postalCode);
    setCountry(address.country);
    setUser_id(address.user_id)
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveAddress({
        address_id: id,
        address,
        city,
        postalCode,
        country,
        user_id
      })
    );
  };

  const deleteHandler = (address) => {
    dispatch(deleteAddress(address.address_id));
  };

  return (
    <div className="content content-margined">
      <div className="category-header">
        <h3>Addresses</h3>
        {!modalVisible && (
          <button className="button primary" onClick={() => openModel({})}>
            Create Address
          </button>
        )}
      </div>
      {modalVisible && (
        <div className="form">
          <form onSubmit={submitHandler}>
            <ul className="form-container">
              <li>
                <h2>Create Address</h2>
              </li>
              <li>
                {loadingSave && <div>Loading...</div>}
                {errorSave && <div>{errorSave}</div>}
              </li>

              <li>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </li>
              <li>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </li>
              <li>
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </li>
              <li>
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
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
              <th>Address</th>
              <th>City</th>
              <th>Postal Code</th>
              <th>Country</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address) => (
              <tr key={address.address_id}>
                <td>{address.address_id}</td>
                <td>{address.address}</td>
                <td>{address.city}</td>
                <td>{address.postalCode}</td>
                <td>{address.country}</td>
                <td>
                  <button className="button" onClick={() => openModel(address)}>
                    Edit
                  </button>{" "}
                  <button className="button" onClick={() => deleteHandler(address)}>
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

export default AddressesScreen;
