import './cart.css';
import { useEffect, useState } from 'react';
import CartCard from '../../components/CartCards/CartCard';
import axios from 'axios';
function CartPopUp({setOpenPopUp, userId, cart, setCart, openPopUp}){
    const [cartProducts, setCartProducts] = useState([]);
   const [totals, setTotals] = useState(0)
  
    
    const onClickHandler = (e) => {
        e.preventDefault();
        setOpenPopUp(false)
}


//get running total
useEffect(() => {
    axios.get(`http://localhost:4000/carts/cart-total?user_id=${userId}`).then((response) => {
        console.log(response.data)
         setTotals(Math.ceil(response.data.total_cost))
        

    
    })
    
}, [cartProducts])
  
  
  
  
  
//fetch cart for current user on mount with dependency of whether cart is open

useEffect(()=>{
    axios.get(`http://localhost:4000/carts/${userId}`).then((response) => {
   const cart = response.data;
   setCart(cart);


 })
  
}, [openPopUp])


  
  useEffect(() => {
    // Fetch product data for each item in the cart
    const productPromises = cart.map((item) => {
      return axios.get(`http://localhost:4000/products/${item.product_id}`);
    });
  
    // Wait for all product requests to complete
    Promise.all(productPromises)
      .then((productResponses) => {
        const productData = productResponses.map((productResponse) => {
          return productResponse.data;
        });
  
        // Now you have product data for each item in the cart
        setCartProducts(productData);
        console.log(productData);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, [cart]);

  
  

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
            {cartProducts.map((cartProduct) => {
                    return <CartCard cart = {cart} cartProducts = {cartProducts} cartProduct={cartProduct}  setCart = {setCart} setCartProducts={setCartProducts} userId = {userId}  />
            })}
        </div>

        <div className="totals-container">

            <p>Total</p>
            <p>{totals}</p>
        </div>
       
            
        </div>

        </div>

    )
}

export default CartPopUp;