import {
  BRAND_LIST_REQUEST,
  BRAND_LIST_SUCCESS,
  BRAND_LIST_FAIL,
  BRAND_SAVE_REQUEST,
  BRAND_SAVE_SUCCESS,
  BRAND_SAVE_FAIL,
  BRAND_DELETE_SUCCESS,
  BRAND_DELETE_FAIL,
  BRAND_DELETE_REQUEST,
} from "../constants/brandConstants";
import axios from "axios";
import Axios from "axios";

const listBrands = () => async (dispatch) => {
  try {
    dispatch({ type: BRAND_LIST_REQUEST });
    const { data } = await axios.get("/api/brands");
    dispatch({ type: BRAND_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: BRAND_LIST_FAIL, payload: error.message });
  }
};

const saveBrand = (brand) => async (dispatch, getState) => {
  try {
    dispatch({ type: BRAND_SAVE_REQUEST, payload: brand });
    const {
      userSignin: { userInfo },
    } = getState();
    if (!brand._id) {
      const { data } = await Axios.post("/api/brands", brand, {
        headers: {
          Authorization: "Bearer " + userInfo.token,
        },
      });
      dispatch({ type: BRAND_SAVE_SUCCESS, payload: data });
    } else {
      const { data } = await Axios.put(
        "/api/brands/" + brand._id,
        brand,
        {
          headers: {
            Authorization: "Bearer " + userInfo.token,
          },
        }
      );
      dispatch({ type: BRAND_SAVE_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({ type: BRAND_SAVE_FAIL, payload: error.message });
  }
};

const deleteBrand = (brandId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    dispatch({ type: BRAND_DELETE_REQUEST, payload: brandId });
    const { data } = await axios.delete("/api/brands/" + brandId, {
      headers: {
        Authorization: "Bearer " + userInfo.token,
      },
    });
    dispatch({ type: BRAND_DELETE_SUCCESS, payload: data, success: true });
  } catch (error) {
    dispatch({ type: BRAND_DELETE_FAIL, payload: error.message });
  }
};

export { listBrands, saveBrand, deleteBrand };
