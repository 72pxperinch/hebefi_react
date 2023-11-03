import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { savePayment, listPayments, detailsPayment } from '../actions/paymentActions';
import CheckoutSteps from '../components/CheckoutSteps';

function PaymentScreen(props) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [creatingNewPayment, setCreatingNewPayment] = useState(false);
  const user_id = useSelector((state) => state.userSignin.userInfo._id);
  const st = useSelector((state) => state)
  console.log(st)

  const dispatch = useDispatch();

  const paymentList = useSelector((state) => state.paymentList);
  const { payments } = paymentList;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!creatingNewPayment) {
      // If an existing payment is selected, dispatch detailsPayment with payment ID.
      console.log(paymentId)
      dispatch(detailsPayment(paymentId));
    } else {
      // If creating a new payment, dispatch savePayment with the payment method data.
      dispatch(savePayment({ paymentMethod, user_id }));
    }
    props.history.push('placeorder');
  };

  useEffect(() => {
    // Fetch the list of user's payments.
    dispatch(listPayments());
  }, [dispatch]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="form">
        <form onSubmit={submitHandler}>
          <ul className="form-container">
            <li>
              <h2>Payment</h2>
            </li>

            <li>
              {payments.length === 0 ? (
                <div>No payment methods available. Please create a new one.</div>
              ) : (
                <div>
                  {payments.map((payment) => (
                    <div key={payment.payment_id}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        id={`paymentMethod-${payment.payment_id}`}
                        value={payment.payment_id}
                        onChange={(e) => setPaymentId(e.target.value)}
                      ></input>
                      <label htmlFor={`paymentMethod-${payment.payment_id}`}>
                        {payment.paymentMethod}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </li>

            <li>
              <div>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="newPayment"
                  value="newPayment"
                  onChange={() => setCreatingNewPayment(true)}
                ></input>
                <label htmlFor="newPayment">Create New Payment</label>
              </div>
            </li>

            {creatingNewPayment && (
              <li>
                <label htmlFor="newPaymentMethod">New Payment Method</label>
                <input
                  type="text"
                  name="newPaymentMethod"
                  id="newPaymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                ></input>
              </li>
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

export default PaymentScreen;
