import {
  ADDRESS_LIST_REQUEST,
  ADDRESS_LIST_SUCCESS,
  ADDRESS_LIST_FAIL,
  ADDRESS_SAVE_REQUEST,
  ADDRESS_SAVE_SUCCESS,
  ADDRESS_SAVE_FAIL,
  ADDRESS_DELETE_REQUEST,
  ADDRESS_DELETE_SUCCESS,
  ADDRESS_DELETE_FAIL,
  ADDRESS_DETAILS_REQUEST,
  ADDRESS_DETAILS_SUCCESS,
  ADDRESS_DETAILS_FAIL,
} from "../constants/addressConstants";
import axios from "axios";
import Axios from "axios";

const listAddress = () => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();

    dispatch({ type: ADDRESS_LIST_REQUEST });

    const { data } = await axios.get("/api/addresses", {
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });

    dispatch({ type: ADDRESS_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ADDRESS_LIST_FAIL, payload: error.message });
  }
};


const saveAddress = (address) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADDRESS_SAVE_REQUEST, payload: address });
    const {
      userSignin: { userInfo },
    } = getState();
    if (!address.address_id) {
      const { data } = await Axios.post("/api/addresses", address, {
        headers: {
          Authorization: "Bearer " + userInfo.token,
        },
      });
      dispatch({ type: ADDRESS_SAVE_SUCCESS, payload: data });
    } else {
      const { data } = await Axios.put(
        "/api/addresses/" + address.address_id,
        address,
        {
          headers: {
            Authorization: "Bearer " + userInfo.token,
          },
        }
      );
      dispatch({ type: ADDRESS_SAVE_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({ type: ADDRESS_SAVE_FAIL, payload: error.message });
  }
};

const deleteAddress = (addressId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    dispatch({ type: ADDRESS_DELETE_REQUEST, payload: addressId });
    const { data } = await axios.delete("/api/addresses/" + addressId, {
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });
    dispatch({ type: ADDRESS_DELETE_SUCCESS, payload: data, success: true });
  } catch (error) {
    dispatch({ type: ADDRESS_DELETE_FAIL, payload: error.message });
  }
};


const detailsAddress = (addressId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    dispatch({ type: ADDRESS_DETAILS_REQUEST, payload: addressId });
    const { data } = await axios.get("/api/addresses/" + addressId, {
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });
    dispatch({ type: ADDRESS_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ADDRESS_DETAILS_FAIL, payload: error.message });
  }
};

export { listAddress, saveAddress, deleteAddress, detailsAddress };
