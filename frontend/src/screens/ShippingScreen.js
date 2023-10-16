// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { saveShipping } from '../actions/cartActions';
// import CheckoutSteps from '../components/CheckoutSteps';
// import { detailsAddress, saveAddress, listAddress } from '../actions/addressActions';

// function ShippingScreen(props) {

//   const [address, setAddress] = useState('');
//   const [city, setCity] = useState('');
//   const [postalCode, setPostalCode] = useState('');
//   const [country, setCountry] = useState('');

//   const dispatch = useDispatch();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(saveAddress({ address, city, postalCode, country }));
//     props.history.push('payment');
//   }
//   return <div>
//     <CheckoutSteps step1 step2 ></CheckoutSteps>
//     <div className="form">
//       <form onSubmit={submitHandler} >
//         <ul className="form-container">
//           <li>
//             <h2>Shipping</h2>
//           </li>

//           <li>
//             <label htmlFor="address">
//               Address
//           </label>
//             <input type="text" name="address" id="address" onChange={(e) => setAddress(e.target.value)}>
//             </input>
//           </li>
//           <li>
//             <label htmlFor="city">
//               City
//           </label>
//             <input type="text" name="city" id="city" onChange={(e) => setCity(e.target.value)}>
//             </input>
//           </li>
//           <li>
//             <label htmlFor="postalCode">
//               Postal Code
//           </label>
//             <input type="text" name="postalCode" id="postalCode" onChange={(e) => setPostalCode(e.target.value)}>
//             </input>
//           </li>
//           <li>
//             <label htmlFor="country">
//               Country
//           </label>
//             <input type="text" name="country" id="country" onChange={(e) => setCountry(e.target.value)}>
//             </input>
//           </li>

//           <li>
//             <button type="submit" className="button primary">Continue</button>
//           </li>

//         </ul>
//       </form>
//     </div>
//   </div>
// }
// export default ShippingScreen;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  detailsAddress,
  saveAddress,
  listAddress,
} from "../actions/addressActions";

function ShippingScreen(props) {
  const [selectedAddress, setSelectedAddress] = useState(""); // To store the selected address ID
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const user_id = useSelector((state) => state.userSignin.userInfo._id);
  const dispatch = useDispatch();
  const userAddressList = useSelector((state) => state.addressList);
  const { addresses } = userAddressList;

  useEffect(() => {
    dispatch(listAddress()); // Fetch the user's list of addresses
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (selectedAddress) {
      // If an address is selected, dispatch detailsAddress with the selected address's ID
      dispatch(detailsAddress(selectedAddress));
    } else {
      // If a new address is created, dispatch saveAddress with the new address details
      dispatch(saveAddress({ address, city, postalCode, country, user_id }));
    }
    props.history.push("payment");
  };

  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="form">
        <form onSubmit={submitHandler}>
          <ul className="form-container">
            <li>
              <h2>Shipping</h2>
            </li>

            <li>
              <label htmlFor="address">Choose an Address or Create New</label>
              <select
                name="selectedAddress"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                <option value="">Create New Address</option>
                {addresses.map((address) => (
                  <option key={address.address_id} value={address.address_id}>
                    {address.address}, {address.city}, {address.postalCode},{" "}
                    {address.country}
                  </option>
                ))}
              </select>
            </li>

            {selectedAddress === "" && ( // Display new address input fields only when creating a new address
              <div>
                <li>
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </li>
                <li>
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </li>
                <li>
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </li>
                <li>
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </li>
              </div>
            )}

            <li>
              <button type="submit" className="button primary">
                Continue
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default ShippingScreen;
