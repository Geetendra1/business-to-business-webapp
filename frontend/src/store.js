import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import { productListReducer,productDetailsReducer } from "./reducer/productReducers";
import Cookie from "js-cookie"
import {cartReducer} from './reducer/cartReducers';
import thunk from 'redux-thunk';
const cartItems = Cookie.getJSON("cartItems") || [];
const initialState = {cart : {cartItems}}

const reducer = combineReducers({
    productList : productListReducer,
    productDetails: productDetailsReducer,
    cart:cartReducer
})

const composeEnhanser = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, initialState, composeEnhanser(applyMiddleware(thunk)))

export default store;