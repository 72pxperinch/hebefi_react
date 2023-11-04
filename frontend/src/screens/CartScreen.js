import React, {useEffect} from "react";
import { addToCart, removeFromCart } from "../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./CSS/CartScreen.css";
import { createOrder } from "../actions/orderActions";

function CartScreen(props) {

  const st = useSelector((state) => state)
  console.log(st)

  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success, error, order } = orderCreate;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const productId = props.match.params.id;
  const qty = props.location.search
    ? Number(props.location.search.split("=")[1])
    : 1;
  const dispatch = useDispatch();
  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  const checkoutHandler = () => {

    dispatch(
      createOrder({
        orderItems: cartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );

  console.log(st)
  };


  useEffect(() => {
    if (success) {
      props.history.push("/signin?redirect=shipping/" + order.data.order_id);
    }
  }, [success, order]);

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
