import {
  PAYMENT_LIST_REQUEST,
  PAYMENT_LIST_SUCCESS,
  PAYMENT_LIST_FAIL,
  PAYMENT_SAVE_REQUEST,
  PAYMENT_SAVE_SUCCESS,
  PAYMENT_SAVE_FAIL,
  PAYMENT_DELETE_REQUEST,
  PAYMENT_DELETE_SUCCESS,
  PAYMENT_DELETE_FAIL,
  PAYMENT_DETAILS_REQUEST,
  PAYMENT_DETAILS_SUCCESS,
  PAYMENT_DETAILS_FAIL,
} from "../constants/paymentConstants";

import axios from "axios";
import Axios from "axios";

const listPayments = () => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();

    dispatch({ type: PAYMENT_LIST_REQUEST });

    const { data } = await axios.get("/api/payments", {
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });

    dispatch({ type: PAYMENT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PAYMENT_LIST_FAIL, payload: error.message });
  }
};

const detailsPayment = (paymentId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    dispatch({ type: PAYMENT_DETAILS_REQUEST, payload: paymentId });
    const { data } = await axios.get("/api/payments/" + paymentId, {
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });
    console.log(data)
    dispatch({ type: PAYMENT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PAYMENT_DETAILS_FAIL, payload: error.message });
  }
};

const savePayment = (payment) => async (dispatch, getState) => {
  try {
    dispatch({ type: PAYMENT_SAVE_REQUEST, payload: payment });
    const {
      userSignin: { userInfo },
    } = getState();
    if (!payment.payment_id) {
      const { data } = await Axios.post("/api/payments", payment, {
        headers: {
          Authorization: "Bearer " + userInfo.token,
        },
      });
      dispatch({ type: PAYMENT_SAVE_SUCCESS, payload: data });
    } else {
      const { data } = await Axios.put(
        "/api/payments/" + payment.payment_id,
        payment,
        {
          headers: {
            Authorization: "Bearer " + userInfo.token,
          },
        }
      );
      dispatch({ type: PAYMENT_SAVE_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({ type: PAYMENT_SAVE_FAIL, payload: error.message });
  }
};

const deletePayment = (paymentId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    dispatch({ type: PAYMENT_DELETE_REQUEST, payload: paymentId });
    const { data } = await axios.delete("/api/payments/" + paymentId, {
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });
    dispatch({ type: PAYMENT_DELETE_SUCCESS, payload: data, success: true });
  } catch (error) {
    dispatch({ type: PAYMENT_DELETE_FAIL, payload: error.message });
  }
};

export { listPayments, savePayment, deletePayment, detailsPayment };
