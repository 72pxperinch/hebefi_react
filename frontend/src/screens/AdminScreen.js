// AdminPage.js
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./CSS/AdminScreen.css";

const AdminScreen = () => {
  const st = useSelector((state) => state)
  console.log(st)
  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <Link to="/orders">
        <div className="card">
          <h2>Orders</h2>
          {/* Add content for the Categories card here */}
        </div>
      </Link>
      <Link to="/categories">
        <div className="card">
          <h2>Categories</h2>
          {/* Add content for the Orders card here */}
        </div>
      </Link>
      <Link to="/brands">
        <div className="card">
          <h2>Brands</h2>
          {/* Add content for the Orders card here */}
        </div>
      </Link>
      <Link to="/products">
        <div className="card">
          <h2>Products</h2>
          {/* Add content for the Orders card here */}
        </div>
      </Link>
    </div> 
  );
};

export default AdminScreen;
