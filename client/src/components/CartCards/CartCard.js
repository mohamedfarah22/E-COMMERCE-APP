import "./CartCard.css";
import { useState, useEffect } from "react";
import axios from "axios";
function CartCard({ cartProduct, adjustTotal, removeTotal,  userId, setCart}){
    
    
    const [numberOfItems, setNumberOfItems] = useState(null);
    
    //add cart object to total sate on mount
 
    useEffect(()=>{
        //get new product
        axios.get(`http://localhost:4000/carts/${userId}`).then((response) => {
       const cart = response.data;
       setCart(cart);
       adjustTotal(cartProduct[0].id, (cartProduct[0].price*numberOfItems))
    
     })
      
    }, [numberOfItems])
    

   const increment = (e) => {
    e.preventDefault()
    const updatedQuantity = numberOfItems + 1
    setNumberOfItems(updatedQuantity)
    axios.put(`http://localhost:4000/carts?user_id=${userId}&product_id=${cartProduct[0].id}&quantity=${numberOfItems}`).then((response) => {
                console.log("response: ", response)
            }).catch((error) => {
                console.log('Error',  error)
            })
    adjustTotal(cartProduct[0].id, (updatedQuantity*cartProduct[0].price))
   }
   const decrement = (e) => {
        e.preventDefault()
            if(numberOfItems === 1 ){
             //remove item from cart and turn if statement to 1
             setNumberOfItems(numberOfItems - 1)
                
            //remove cart item from db
            axios.delete(`http://localhost:4000/carts?user_id=${userId}&product_id=${cartProduct[0].id}`).then((response) => {
                console.log('Response:', response.data);
              }).catch((error) => {
                console.error('Error:', error);
            });
        //remove item from running total
        removeTotal(cartProduct[0].id)
            }
            else{
            setNumberOfItems(numberOfItems - 1)
            //change quantity of item in db
            axios.put(`http://localhost:4000/carts?user_id=${userId}&product_id=${cartProduct[0].id}&quantity=${numberOfItems}`).then((response) => {
                console.log("response: ", response)
            }).catch((error) => {
                console.log('Error',  error)
            })
             }
             adjustTotal(cartProduct[0].id, (numberOfItems*cartProduct[0].price))
  
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
            <button onClick = {decrement}>-</button>
            <p className="quantity-text">{numberOfItems}</p>
            <button onClick = {increment}>+</button>
        </div>
    </div>
       
    )
    
}

export default CartCard;