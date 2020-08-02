import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import { productListReducer,productDetailsReducer, productSaveReducer,productDeleteReducer } from "./reducer/productReducers";
import Cookie from "js-cookie"
import {cartReducer} from './reducer/cartReducers';
import thunk from 'redux-thunk';
import {userSigninReducer, userRegisterReducer} from './reducer/userReducers'

const cartItems = Cookie.getJSON("cartItems") || [];
const userInfo = Cookie.getJSON("userInfo") || null;


const initialState = {cart : {cartItems}, userSignin:{userInfo}}

const reducer = combineReducers({
    productList : productListReducer,
    productDetails: productDetailsReducer,
    cart:cartReducer,
    userSignin:userSigninReducer,
    userRegister:userRegisterReducer,
    productSave:productSaveReducer,
    productDelete:productDeleteReducer

})

const composeEnhanser = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, initialState, composeEnhanser(applyMiddleware(thunk)))

export default store;