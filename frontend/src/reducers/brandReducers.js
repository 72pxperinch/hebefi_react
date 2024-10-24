import {
  BRAND_LIST_REQUEST,
  BRAND_LIST_SUCCESS,
  BRAND_LIST_FAIL,
  BRAND_SAVE_REQUEST,
  BRAND_SAVE_SUCCESS,
  BRAND_SAVE_FAIL,
  BRAND_DELETE_REQUEST,
  BRAND_DELETE_SUCCESS,
  BRAND_DELETE_FAIL,
} from '../constants/brandConstants';

function brandListReducer(state = { brands: [] }, action) {
  switch (action.type) {
    case BRAND_LIST_REQUEST:
      return { loading: true, brands: [] };
    case BRAND_LIST_SUCCESS:
      return { loading: false, brands: action.payload };
    case BRAND_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}


function brandDeleteReducer(state = { brand: {} }, action) {
  switch (action.type) {
    case BRAND_DELETE_REQUEST:
      return { loading: true };
    case BRAND_DELETE_SUCCESS:
      return { loading: false, brand: action.payload, success: true };
    case BRAND_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function brandSaveReducer(state = { brand: {} }, action) {
  switch (action.type) {
    case BRAND_SAVE_REQUEST:
      return { loading: true };
    case BRAND_SAVE_SUCCESS:
      return { loading: false, success: true, brand: action.payload };
    case BRAND_SAVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
export {
  brandListReducer,
  brandSaveReducer,
  brandDeleteReducer,
};