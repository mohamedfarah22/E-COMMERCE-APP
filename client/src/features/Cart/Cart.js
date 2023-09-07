import './cart.css';
import { useEffect, useState } from 'react';
import CartCard from '../../components/CartCards/CartCard';
function CartPopUp({setOpenPopUp, loggedIn, cartItems, cart, setCart}){
   
    const onClickHandler = (e) => {
        e.preventDefault();
        setOpenPopUp(false)
}
const getCartTotal = (cart) => {
    let total = 0;
    cart.forEach((item) => {
        total += (item.price * item.quantity)
        
    })
    return total
}

useEffect(() => {
    if(loggedIn){
        //get cart items for logged in user
    }
    const total = getCartTotal(cart)

}, [loggedIn])


    return (
        <div classname="popup-container">
        <div className="popup-body">
        <div classname="close-text-container">
            <span class="material-icons" onClick = {onClickHandler}>
            close
             </span>
            <h4 className="cart-heading">Cart</h4>
        </div>
        <div className="cart-items-container">
            {cartItems.map((cartItem) => {
                return <CartCard cartItem = {cartItem} cart = {cart} setCart = {setCart}/>
            })}
        </div>
        <div>

        </div>
       { getCartTotal(cart) ? <p>{getCartTotal(cart)}</p>: null}
            
        </div>

        </div>

    )
}

export default CartPopUp;