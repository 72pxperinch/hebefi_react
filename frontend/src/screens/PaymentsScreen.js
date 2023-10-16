import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  savePayment,
  listPayments,
  deletePayment,
} from "../actions/paymentActions";

function PaymentsScreen(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [user_id, setUser_id] = useState("");

  const paymentList = useSelector((state) => state.paymentList);
  const { payments } = paymentList;

  const paymentSave = useSelector((state) => state.paymentSave);
  const {
    loading: loadingSave,
    success: successSave,
    error: errorSave,
  } = paymentSave;

  const paymentDelete = useSelector((state) => state.paymentDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = paymentDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listPayments());
  }, []);

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
    }
    dispatch(listPayments());
  }, [successSave, successDelete]);

  const openModel = (payment) => {
    setModalVisible(true);
    setId(payment.payment_id);
    setPaymentMethod(payment.paymentMethod);
    setUser_id(payment.user_id);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      savePayment({
        payment_id: id,
        paymentMethod,
        user_id,
      })
    );
  };

  const deleteHandler = (payment) => {
    dispatch(deletePayment(payment.payment_id));
  };

  return (
    <div className="content content-margined">
      <div className="category-header">
        <h3>Payments</h3>
        {!modalVisible && (
          <button className="button primary" onClick={() => openModel({})}>
            Create Payment
          </button>
        )}
      </div>
      {modalVisible && (
        <div className="form">
          <form onSubmit={submitHandler}>
            <ul className="form-container">
              <li>
                <h2>Create Payment</h2>
              </li>
              <li>
                {loadingSave && <div>Loading...</div>}
                {errorSave && <div>{errorSave}</div>}
              </li>

              <li>
                <label htmlFor="paymentMethod">Payment Method</label>
                <input
                  type="text"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
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
              <th>Payment Method</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.payment_id}>
                <td>{payment.payment_id}</td>
                <td>{payment.paymentMethod}</td>
                <td>
                  <button className="button" onClick={() => openModel(payment)}>
                    Edit
                  </button>{" "}
                  <button className="button" onClick={() => deleteHandler(payment)}>
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

export default PaymentsScreen;
