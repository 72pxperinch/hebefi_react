import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Navbar from "./screens/Components/Navbar";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProductsScreen from "./screens/ProductsScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrdersScreen from "./screens/OrdersScreen";
import CategoryScreen from "./screens/CategoryScreen";
import Footer from "./screens/Components/Footer";

function App() {
  const [on, setOn] = useState("menu");
  const [active, setActive] = useState("hamburger");

  function toggle(event) {
    on === "menu" ? setOn("menu menu-down") : setOn("menu");
    active === "hamburger"
      ? setActive("hamburger is-active")
      : setActive("hamburger");

    event.preventDefault();
  }
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main">
        <div className="content">
          <Route path="/orders" component={OrdersScreen} />
          <Route path="/profile" component={ProfileScreen} />
          <Route path="/order/:id" component={OrderScreen} />
          <Route path="/products" component={ProductsScreen} />
          <Route path="/shipping" component={ShippingScreen} />
          <Route path="/payment" component={PaymentScreen} />
          <Route path="/placeorder" component={PlaceOrderScreen} />
          <Route path="/signin" component={SigninScreen} />
          <Route path="/register" component={RegisterScreen} />
          <Route path="/product/:id" component={ProductScreen} />
          <Route path="/cart/:id?" component={CartScreen} />
          <Route path="/category/:id" component={CategoryScreen} />
          <Route path="/" exact={true} component={HomeScreen} />
        </div>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
