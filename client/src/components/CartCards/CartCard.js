import "./CartCard.css";
import { useState, useEffect } from "react";
import axios from "axios";
function CartCard({ cart, cartProduct, userId, setCart}){
    
    //create states t disable buttons
    const [loading, setLoading] = useState(false)
    const [numberOfItems, setNumberOfItems] = useState(null)
    const baseURL = process.env.REACT_APP_API_URL;
    //add cart object to total sate on mount
   useEffect(() => {
    cart.forEach((cartItem) => {
        if(cartItem.product_id === cartProduct[0].id){
            setNumberOfItems(cartItem.quantity)
        }
    })
   }, [cart])
 
    useEffect(()=>{
        //get new product
        
    axios.get(`${baseURL}/carts/${userId}`).then((response) => {
    const cart = response.data;
    setCart(cart);
    setLoading(false)
    
     })
      
    }, [numberOfItems])
    

const increment = (e) => {
    e.preventDefault()
    const updatedQuantity = numberOfItems + 1
    setLoading(true)
    axios.put(`${baseURL}/carts?user_id=${userId}&product_id=${cartProduct[0].id}&quantity=${updatedQuantity}`).then((response) => {
                //set quantity
                setNumberOfItems(response.data.quantity)
                
            }).catch((error) => {
                console.log('Error',  error)
            });
            
                
                
            
   }

   const decrement = (e) => {
        e.preventDefault()
            if(numberOfItems === 1 ){
       
            
                
            //remove cart item from db
            axios.delete(`${baseURL}/carts?user_id=${userId}&product_id=${cartProduct[0].id}`).then((response) => {
                //remove item from running total
               
                
                setNumberOfItems(numberOfItems - 1)
                //remove from cartProducts
              }).catch((error) => {
                console.error('Error:', error);
            });
        
       
            }
            else{
            const newQuantity = numberOfItems-1
            //change quantity of item in db
            axios.put(`${baseURL}/carts?user_id=${userId}&product_id=${cartProduct[0].id}&quantity=${newQuantity}`).then((response) => {
                setNumberOfItems(newQuantity)
            }).catch((error) => {
                console.log('Error',  error)
            })
            
             }
             
  
     }

 

    useEffect(() => {
        axios
          .get(`${baseURL}/carts/user-product-queries?user_id=${userId}&product_id=${cartProduct[0].id}`)
          .then((response) => {
           
            const quantity = response.data[0].quantity;
          
            setNumberOfItems(quantity); // Update the state with the fetched quantity
          })
          .catch((error) => {
            console.error('Error fetching numberOfItems:', error);
          });
      }, [userId]); 
    return (
       <div> 
        <div className = 'card-cart-container'>
        <div className = "cart-product-image-container" >
            <img alt = {cartProduct[0].product_name} src={`${cartProduct[0].image_url}`} />
        </div>
        <div className="cart-item-description">
            <p className="cart-product-name">{cartProduct[0].product_name}</p>
            <p className = 'cart-product-price'>{`$${cartProduct[0].price}`}</p>
        </div>
        </div>
        <div className="quanity">
            <button className="quantity-button" disabled = {loading} onClick = {decrement}>-</button>
            <p className="quantity-text">{numberOfItems}</p>
            <button className="quantity-button"  disabled = {loading} onClick = {increment}>+</button>
        </div>
    </div>
       
    )
    
}

export default CartCard;