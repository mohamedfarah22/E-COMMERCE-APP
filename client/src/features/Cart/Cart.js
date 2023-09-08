import './cart.css';
import { useEffect, useState } from 'react';
import CartCard from '../../components/CartCards/CartCard';
import axios from 'axios';
function CartPopUp({setOpenPopUp, cartItems, userId, cart, setCart}){
    const [cartProducts, setCartProducts] = useState([]);
    const [totals, setTotals] = useState([]); //set running total 
    const onClickHandler = (e) => {
        e.preventDefault();
        setOpenPopUp(false)
}
//add totals array each number in this array represents the running total of each item in cart
 const adjustTotal = (id, total) => {
        setTotals((prevTotals) => {
          // Check if the id already exists in the totals array
          const index = prevTotals.findIndex((item) => item.id === id);
      
          if (index !== -1) {
            // If the id exists, update the total for that item
            const updatedTotals = [...prevTotals];
            updatedTotals[index].total = total;
            return updatedTotals;
          } else {
            // If the id doesn't exist, add a new entry
            return [...prevTotals, { id: id, total: total }];
          }
        });
      };
//remove item from totals array when item is removed
const removeTotal = (id) => {
    setTotals((prevTotals) => {
      // Use the filter method to create a new array without the object with the specified id
      const updatedTotals = prevTotals.filter((item) => item.id !== id);
      return updatedTotals;
    });
  };
  




useEffect(() => {
    // Fetch cart data
    axios.get(`http://localhost:4000/carts/${userId}`)
      .then((response) => {
        const cart = response.data;
        setCart(cart);
      })
      .catch((error) => {
        console.error('Error fetching cart data:', error);
      });
  }, [userId]);
  
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
                    return <CartCard cartProduct={cartProduct}  setCart = {setCart} setCartProducts={setCartProducts} userId = {userId} adjustTotal = {adjustTotal} removeTotal = {removeTotal} />
            })}
        </div>
        <div>

        </div>
       
            
        </div>

        </div>

    )
}

export default CartPopUp;