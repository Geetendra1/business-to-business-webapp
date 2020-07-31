import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import { productListReducer,productDetailsReducer } from "./reducer/productReducers";
import thunk from 'redux-thunk';
const initialState = {}

const reducer = combineReducers({
    productList : productListReducer,
    productDetails: productDetailsReducer
})

const composeEnhanser = window.__REDUX_DEVTOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, initialState, composeEnhanser(applyMiddleware(thunk)))

export default store;