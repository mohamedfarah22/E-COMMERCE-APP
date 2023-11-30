import './cart.css';
import { useEffect, useState } from 'react';
import CartCard from '../../components/CartCards/CartCard';
import axios from 'axios';
import { usePopup } from '../Cart/CartPopUpContext';
import { useCart } from './CartContext';
import { roundUpToTwoDecimalPlaces } from './CartHelperFunctions';
import { useNavigate} from 'react-router-dom';
function CartPopUp({ userId}){
    const [cartProducts, setCartProducts] = useState([]);
   const [totals, setTotals] = useState(0)
   const {openPopUp, setOpenPopUp} = usePopup()
   const {cart, setCart} = useCart();
    const baseURL = process.env.REACT_APP_API_URL;
    const onClickHandler = (e) => {
        e.preventDefault();
        setOpenPopUp(false)
}
 

//get running total
useEffect(() => {
    axios.get(`${baseURL}/carts/cart-total?user_id=${userId}`).then((response) => {
      
         setTotals(roundUpToTwoDecimalPlaces(response.data.total_cost))
        

    
    })
    
}, [cartProducts, userId])
  
  
  
  
  
//fetch cart for current user on mount with dependency of whether cart is open

useEffect(()=>{
    axios.get(`${baseURL}/carts/${userId}`).then((response) => {
   const cart = response.data;
   setCart(cart);


 })
  
}, [openPopUp, userId])


  
  useEffect(() => {
    // Fetch product data for each item in the cart
    const productPromises = cart.map((item) => {
      return axios.get(`${baseURL}/products/${item.product_id}`);
    });
  
    // Wait for all product requests to complete
    Promise.all(productPromises)
      .then((productResponses) => {
        const productData = productResponses.map((productResponse) => {
          return productResponse.data;
        });
  
        // Now you have product data for each item in the cart
        setCartProducts(productData);
    
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, [cart]);

  //redirect to checkout page after customer is happy with cart
  const onClickHandlerCheckout = (e) =>{
    e.preventDefault();
    
    axios.post(`${baseURL}/check-out`, cart).then((response) => {
          
     window.open(response.data.url)
    }).catch((error) => {
      console.log(cart)    
      console.log('Error ', error);
    })
  }
  

    return (
        <div className="popup-container">
        <div className="popup-body">
        <div className="close-text-container" >
            <span className="material-icons" onClick = {onClickHandler}>
            close
             </span>
            <h4 className="cart-heading">Cart</h4>
            {cart.length === 0 ? <p className="empty-cart">Your cart is empty</p>: null}
        </div>
        <div className="cart-items-container">
            {cartProducts.map((cartProduct) => {
                    return <CartCard key = {cartProduct[0].product_name} cart = {cart} cartProducts = {cartProducts} cartProduct={cartProduct}  setCart = {setCart} setCartProducts={setCartProducts} userId = {userId}  />
            })}
        </div>

            {cart.length === 0 ? 
             null
            : 
    <>
        <div className="totals-container">
            <p className="total-heading">Total</p>
            <p className="total-value">{`$${totals}`}</p>
         </div>
         <button onClick={onClickHandlerCheckout} className = "check-out-button">Check Out</button>
    </>
         }
       
            
      
            
        </div>

        </div>

    )
}

export default CartPopUp;