import React,{useEffect} from 'react';
import {addToCart,removeFromCart} from "../actions/CartActions"
import {useSelector,useDispatch} from "react-redux";
import { Link } from 'react-router-dom';
function CartScreen(props) {

    const cart = useSelector(state => state.cart)
    const {cartItems} = cart;
    const dispatch = useDispatch();
    const productId = props.match.params.id;
    const qty = props.location.search ? Number(props.location.search.split("=")[1]):1;

    
   const removeFromCartHandler = (productId) => {
        dispatch(removeFromCart(productId));
   }

    const CheckoutHandler = () => {
      props.history.push("/signin?redirect=shipping")
    }
   
    useEffect(() => {
    if(productId){
        dispatch(addToCart(productId,qty))
    }
    }, []);
    
    return <div className="cart">
        <div className="cart-list">
        <ul className="cart-list-container">
        <li>
          <h3>
            Shopping Cart
          </h3>
          <div>
            Price
          </div>
        </li>

        {
            cartItems.length === 0 ? 
            <div>
                cart is empty
            </div> :

            cartItems.map(item => 
            <li key={item.product}>
             <div className="cart-image">
                  <img src={item.image} alt="product" />
             </div>
            <div className="cart-name">
                  <div>
                    <Link to={"/product/" + item.product}>
                      {item.name}
                    </Link>
                </div>
                <div >
                    Qty:
                  <select className="button" value={item.qty} onChange={(e) => dispatch(addToCart(item.product, e.target.value))}>
                      {[...Array(item.countInStock).keys()].map(x =>
                        <option  key={x + 1} value={x + 1}>{x + 1}</option>
                      )}
                    </select>
                    <button type="button" className="button" onClick={() => removeFromCartHandler(item.product)}>
                      Delete
                    </button>
                  </div>
            </div>
            <div className="cart-price">
                  ${item.price}
                </div>
            </li>
            )
        }
        </ul>
        </div>
    <div className="cart-action">
      <h3>
        Subtotal ( {cartItems.reduce((a, c) => a + c.qty, 0)} items)
        :
         $ {cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
      </h3>
      <button  onClick={CheckoutHandler}  className="button primary full-width" disabled={cartItems.length === 0}>
        Proceed to Checkout
      </button>

    </div>
    </div>
}

export default CartScreen