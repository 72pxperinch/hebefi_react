import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { detailsOrder, createOrder } from "../actions/orderActions";

function PlaceOrderScreen(props) {
  const dispatch = useDispatch();
  const st = useSelector((state) => state);
  console.log(st);

  // const cart = useSelector((state) => state.cart);
  // const { cartItems } = cart;
  const orderCreate = useSelector((state) => state.orderCreate);
  const { loading, success: successCreate, error, order } = orderCreate;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { success: successDetail, detailedOrder } = orderDetails;

  const [isLoading, setIsLoading] = useState(true);

  // Handle loading state
  useEffect(
    () => {
      dispatch(detailsOrder(props.match.params.id));
    },
    []
  );
  useEffect(() => {
    if (detailedOrder) {
      console.log(detailedOrder);
      setIsLoading(false);
    }
  }, [detailedOrder]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!detailedOrder.address) {
    props.history.push("/shipping/" + order.data.order_id);
  } else if (!detailedOrder.paymentMethod) {
    props.history.push("/payment/" + order.data.order_id);
  }
  console.log(detailedOrder);
  const cartItems = detailedOrder.orderItems;
  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = () => {
    props.history.push("/order/" + props.match.params.id);
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <div className="placeorder">
        <div className="placeorder-info">
          <div>
            <h3>Shipping</h3>
            <div>
              {detailedOrder.address}, {detailedOrder.city},
              {detailedOrder.postalCode}, {detailedOrder.country},
            </div>
          </div>
          <div>
            <h3>Payment</h3>
            <div>Payment Method: {detailedOrder.paymentMethod}</div>
          </div>
          <div>
            <ul className="cart-list-container">
              <li>
                <h3>Shopping Cart</h3>
                <div>Price</div>
              </li>
              {cartItems.length === 0 ? (
                <div>Cart is empty</div>
              ) : (
                cartItems.map((item) => (
                  <li>
                    <div className="cart-image">
                      <img src={item.images} alt="product" />
                    </div>
                    <div className="cart-name">
                      <div>
                        <Link to={"/product/" + item.product}>{item.name}</Link>
                      </div>
                      <div>Qty: {item.qty}</div>
                    </div>
                    <div className="cart-price">${item.price}</div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div className="placeorder-action">
          <ul>
            <li>
              <button
                className="button primary full-width"
                onClick={placeOrderHandler}
              >
                Place Order
              </button>
            </li>
            <li>
              <h3>Order Summary</h3>
            </li>
            <li>
              <div>Items</div>
              <div>${itemsPrice}</div>
            </li>
            <li>
              <div>Shipping</div>
              <div>${shippingPrice}</div>
            </li>
            <li>
              <div>Tax</div>
              <div>${taxPrice}</div>
            </li>
            <li>
              <div>Order Total</div>
              <div>${totalPrice}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderScreen;
