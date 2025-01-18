import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk } from 'redux-thunk';// Corrected import
import { composeWithDevTools } from '@redux-devtools/extension';
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productReviewsReducer, reviewReducer } from './reducers/productReducer';
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from './reducers/userReducer';
import { cartReducer } from "./reducers/cartReducer";
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer } from './reducers/orderReducer';
import { myOrders } from './actions/orderAction';
import { newReview } from './actions/productAction';

// Combine individual reducers into a single root reducer
const reducer = combineReducers({
   products: productReducer,
   productDetails: productDetailsReducer,
   user: userReducer,
   profile: profileReducer,
   forgotPassword: forgotPasswordReducer,
   cart: cartReducer,
   newOrder:newOrderReducer,
   myOrders: myOrdersReducer,
   orderDetails:orderDetailsReducer,
   newReview : newReviewReducer,
   newProduct: newProductReducer,
   product:productReducer,
   allOrders:allOrdersReducer,
    order: orderReducer,
   allUsers:allUsersReducer,
   userDetails:userDetailsReducer,
   productReviews: productReviewsReducer,
   review:reviewReducer,
});

// Define the initial state of the store 
let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],

    shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    :{},
  }
};

// List of middleware to apply to the store
const middleware = [thunk];

// Create the Redux store with reducers, initial state, and middleware
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
