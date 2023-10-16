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
} from '../constants/addressConstants';

function addressListReducer(state = { addresses: [] }, action) {
  switch (action.type) {
    case ADDRESS_LIST_REQUEST:
      return { loading: true, addresses: [] };
    case ADDRESS_LIST_SUCCESS:
      return { loading: false, addresses: action.payload };
    case ADDRESS_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function addressDeleteReducer(state = { address: {} }, action) {
  switch (action.type) {
    case ADDRESS_DELETE_REQUEST:
      return { loading: true };
    case ADDRESS_DELETE_SUCCESS:
      return { loading: false, address: action.payload, success: true };
    case ADDRESS_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function addressSaveReducer(state = { address: {} }, action) {
  switch (action.type) {
    case ADDRESS_SAVE_REQUEST:
      return { loading: true };
    case ADDRESS_SAVE_SUCCESS:
      return { loading: false, success: true, address: action.payload };
    case ADDRESS_SAVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

function addressDetailsReducer(state = { address: {} }, action) {
  switch (action.type) {
    case ADDRESS_DETAILS_REQUEST:
      return { loading: true };
    case ADDRESS_DETAILS_SUCCESS:
      return { loading: false, address: action.payload };
    case ADDRESS_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
export {
  addressListReducer,
  addressSaveReducer,
  addressDeleteReducer,
  addressDetailsReducer,
};
