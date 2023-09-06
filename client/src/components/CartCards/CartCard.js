import "./CartCard.css";
import { useState } from "react";
function CartCard({cartItems, setCartItems, cartItem, removeItemFromCart}){
   const [numberOfItems, setNumberOfItems] = useState(1)
   const increment = (e) => {
    e.preventDefault()
    setNumberOfItems(numberOfItems + 1)
   }
   const decrement = (e) => {
    e.preventDefault()
    if(numberOfItems === 0 ){
        //remove item from cart and turn if statement to 1
      

    }
    else{
    setNumberOfItems(numberOfItems - 1)
    }
   }

    return (
       <div> 
        <div className = 'card-cart-container'>
        <div className = "cart-product-image-container" >
            <img src={cartItem.image_url} />
        </div>
        <div className="cart-item-description">
            <p className="cart-product-name">{cartItem.product_name}</p>
            <p className = 'cart-product-price'>{`$${cartItem.price}`}</p>
        </div>
        </div>
        <div className="quanity">
            <button onClick = {decrement}>-</button>
            <p className="quantity-text">{numberOfItems}</p>
            <button onClick = {increment}>+</button>
        </div>
    </div>
       
    )
    
}

export default CartCard;