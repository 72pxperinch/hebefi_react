import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Cookie from 'js-cookie';
import {
  productListReducer,
  productDetailsReducer,
  productSaveReducer,
  productDeleteReducer,
  productReviewSaveReducer,
} from './reducers/productReducers';
import {
  categoryListReducer,
  categorySaveReducer,
  categoryDeleteReducer,
} from './reducers/categoryReducers';
import {
  brandListReducer,
  brandSaveReducer,
  brandDeleteReducer,
} from './reducers/brandReducers';
import {
  paymentListReducer,
  paymentSaveReducer,
  paymentDeleteReducer,
  paymentDetailsReducer
} from './reducers/paymentReducers';
import {
  addressListReducer,
  addressSaveReducer,
  addressDeleteReducer,
  addressDetailsReducer,
} from './reducers/addressReducers';
import { cartReducer } from './reducers/cartReducers';
import {
  userSigninReducer,
  userRegisterReducer,
  userUpdateReducer,
} from './reducers/userReducers';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  myOrderListReducer,
  orderListReducer,
  orderDeleteReducer,
} from './reducers/orderReducers';

const cartItems = Cookie.getJSON('cartItems') || [];
const userInfo = Cookie.getJSON('userInfo') || null;

const initialState = {
  cart: { cartItems, shipping: {}, payment: {} },
  userSignin: { userInfo },
};
const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  productSave: productSaveReducer,
  productDelete: productDeleteReducer,
  productReviewSave: productReviewSaveReducer,
  categoryList: categoryListReducer,
  categorySave: categorySaveReducer,
  categoryDelete: categoryDeleteReducer,
  brandList: brandListReducer,
  brandSave: brandSaveReducer,
  brandDelete: brandDeleteReducer,
  paymentList: paymentListReducer,
  paymentSave: paymentSaveReducer,
  paymentDelete: paymentDeleteReducer,
  paymentDetails: paymentDetailsReducer,
  addressList: addressListReducer,
  addressSave: addressSaveReducer,
  addressDelete: addressDeleteReducer,
  addressDetails: addressDetailsReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  userUpdate: userUpdateReducer,
  myOrderList: myOrderListReducer,
  orderList: orderListReducer,
  orderDelete: orderDeleteReducer,
});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);
export default store;
