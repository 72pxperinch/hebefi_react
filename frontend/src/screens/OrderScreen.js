import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrder, detailsOrder, payOrder } from "../actions/orderActions";
import PaypalButton from "../components/PaypalButton";
function OrderScreen(props) {
  const orderPay = useSelector((state) => state.orderPay);
  const {
    loading: loadingPay,
    success: successPay,
    error: errorPay,
  } = orderPay;
  const dispatch = useDispatch();
  const st = useSelector((state) => state);
  console.log(st);
  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, detailedOrder, error } = orderDetails;

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (successPay) {
      props.history.push("/profile");
    } else {
      dispatch(detailsOrder(props.match.params.id));
    }
    return () => {};
  }, [successPay]);
  
  useEffect(() => {
    if (detailedOrder) {
      setIsLoading(false);
    }
  }, [detailedOrder]);

  if (isLoading) {
    return <div>Loading...</div>;
  }


  const handleSuccessPayment = (paymentResult) => {
    dispatch(payOrder(detailedOrder, paymentResult));
  };
  console.log(detailedOrder);
  return loading ? (
    <div>Loading ...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <div className="placeorder">
        <div className="placeorder-info">
          <div>
            <h3>Shipping</h3>
            <div>
              {detailedOrder.address}, {detailedOrder.city},
              {detailedOrder.postalCode}, {detailedOrder.country},
            </div>
            <div>
              {detailedOrder.isDelivered
                ? "Delivered at " + detailedOrder.deliveredAt
                : "Not Delivered."}
            </div>
          </div>
          <div>
            <h3>Payment</h3>
            <div>Payment Method: {detailedOrder.paymentMethod}</div>
            <div>
              {detailedOrder.isPaid
                ? "Paid at " + detailedOrder.paidAt
                : "Not Paid."}
            </div>
          </div>
          <div>
            <ul className="cart-list-container">
              <li>
                <h3>Shopping Cart</h3>
                <div>Price</div>
              </li>
              {detailedOrder.orderItems.length === 0 ? (
                <div>Cart is empty</div>
              ) : (
                detailedOrder.orderItems.map((item) => (
                  <li key={item.product_id}>
                    <div className="cart-image">
                      <img src={item.image} alt="product" />
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
            <li className="placeorder-actions-payment">
              {loadingPay && <div>Finishing Payment...</div>}
              {!detailedOrder.isPaid &&
                <PaypalButton
                  amount={detailedOrder.totalPrice}
                  onSuccess={handleSuccessPayment} />
              }
            </li>
            <li>
              <h3>Order Summary</h3>
            </li>
            <li>
              <div>Items</div>
              <div>${detailedOrder.itemsPrice}</div>
            </li>
            <li>
              <div>Shipping</div>
              <div>${detailedOrder.shippingPrice}</div>
            </li>
            <li>
              <div>Tax</div>
              <div>${detailedOrder.taxPrice}</div>
            </li>
            <li>
              <div>Order Total</div>
              <div>${detailedOrder.totalPrice}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;
