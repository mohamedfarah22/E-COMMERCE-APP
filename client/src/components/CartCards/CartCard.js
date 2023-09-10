import "./CartCard.css";
import { useState, useEffect } from "react";
import axios from "axios";
function CartCard({ cart, cartProduct, userId, setCart}){
    
    //create states t disable buttons
    const [loading, setLoading] = useState(false)
    const [numberOfItems, setNumberOfItems] = useState(null)
    
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
        
        axios.get(`http://localhost:4000/carts/${userId}`).then((response) => {
       const cart = response.data;
       setCart(cart);
       setLoading(false)
    
     })
      
    }, [numberOfItems])
    

const increment = (e) => {
    e.preventDefault()
    const updatedQuantity = numberOfItems + 1
    setNumberOfItems(updatedQuantity)
    setLoading(true)
    axios.put(`http://localhost:4000/carts?user_id=${userId}&product_id=${cartProduct[0].id}&quantity=${updatedQuantity}`).then((response) => {
                console.log("response: ", response)
                
            }).catch((error) => {
                console.log('Error',  error)
            });
            
                
                
            
   }

   const decrement = (e) => {
        e.preventDefault()
            if(numberOfItems === 1 ){
       
            
                
            //remove cart item from db
            axios.delete(`http://localhost:4000/carts?user_id=${userId}&product_id=${cartProduct[0].id}`).then((response) => {
                //remove item from running total
                console.log('Response:', response.data);
                
                setNumberOfItems(numberOfItems - 1)
                //remove from cartProducts
              }).catch((error) => {
                console.error('Error:', error);
            });
        
       
            }
            else{
            const newQuantity = numberOfItems-1
            //change quantity of item in db
            axios.put(`http://localhost:4000/carts?user_id=${userId}&product_id=${cartProduct[0].id}&quantity=${newQuantity}`).then((response) => {
                setNumberOfItems(newQuantity)
                console.log("response: ", response)
            }).catch((error) => {
                console.log('Error',  error)
            })
            
             }
             
  
     }

 

    useEffect(() => {
        axios
          .get(`http://localhost:4000/carts/user-product-queries?user_id=${userId}&product_id=${cartProduct[0].id}`)
          .then((response) => {
            console.log(response.data)
            const quantity = response.data[0].quantity;
            console.log(quantity)
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
            <img src={cartProduct[0].image_url} />
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