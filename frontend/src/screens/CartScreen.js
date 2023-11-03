import React, { useEffect } from "react";
import { addToCart, removeFromCart } from "../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./CSS/CartScreen.css";
function CartScreen(props) {
  const st = useSelector((state) => state)
  console.log(st)
  const cart = useSelector((state) => state.cart);
console.log(cart)
  const { cartItems } = cart;

  const productId = props.match.params.id;
  const qty = props.location.search
    ? Number(props.location.search.split("=")[1])
    : 1;
  const dispatch = useDispatch();
  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId));
  };
  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, []);

  const checkoutHandler = () => {
    props.history.push("/signin?redirect=shipping");
  };

  return (
    <div className="cartbox">
      <div className="cartlist">
        <div className="carthead">
          <div className="cartitemname">Cart Items</div>
          <div className="cartprops">Quantity</div>
          <div className="cartprops">Price</div>
          <div className="dlt">Delete</div>
        </div>

        {cartItems.length === 0 ? (
          <div>Cart is empty</div>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="cartitems">
              <img src={item.images} loading="lazy" alt="" className="cartitemimg" />
              <div className="cartitemnamecard">
                <Link className="Link" to={"/product/" + item.product}>
                  {item.name}
                </Link>
                <p className="cartpara">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <div className="cartpropitem">
                <select
                  value={item.qty}
                  onChange={(e) =>
                    dispatch(addToCart(item.product, e.target.value))
                  }
                >
                  {[...Array(item.stock_quantity).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="cartpropitem">Rs.{item.price}</div>
              <div className="dltitem">
                <button
                  type="button"
                  className="button"
                  onClick={() => removeFromCartHandler(item.product)}
                >
                  Dlt
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="checkoutcard">
        <div className="checkoutwrap">
          <div className="checkouthead">Summary</div>
          <div className="checkoutdivider"></div>
          <div className="checkoutitems">
            <div>Item Total</div>
            <div>Rs.</div>
          </div>
          <div className="checkoutitems">
            <div>Shipping Total</div>
            <div>Rs.</div>
          </div>
          <div className="checkoutdivider"></div>
          <div className="checkouttotal">
            <div>Sub Total</div>
            <div>
              ( {cartItems.reduce((a, c) => a + c.qty, 0)} items) : Rs.{" "}
              {cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
            </div>
          </div>
          <button
            onClick={checkoutHandler}
            className="checkoutbtn"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartScreen;
