import './ProductPage.css'
import Header from '../Header/Header';
import Categories from '../Categories/Categories';
import CartPopUp from '../Cart/Cart';
import { useState, useEffect} from 'react';
function ProductPage({selectedProduct, filterCategory, setFilterCategory, loggedIn, cartItems, setCartItems}){
    const [openPopUp, setOpenPopUp]  =useState(false);
    const [cart, setCart] = useState([])
    const onClickHandler = (e) => {
        e.preventDefault();
    if(cartItems.length === 0){
        setCartItems([selectedProduct])
    }
    else{setCartItems([...cartItems, selectedProduct])}
      if(loggedIn){
        //logic to send cart items to database
      }
     
      setOpenPopUp(true)
    }

    useEffect(() => {
        cartItems.forEach((item) => {
            if(cart.length === 0){
                setCart([{id: item.id, price: item.price, quantity: 1}])
            }
            else{
                setCart([...cart, {id: item.id, price: item.price, quantity: 1}])
            }
          })
    }, [cartItems])
    return(
    <div>
        <Header setOpenPopUp = {setOpenPopUp}/>
        <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
        {openPopUp ?
        <div className="cart-container">
         <CartPopUp setOpenPopUp = {setOpenPopUp} loggedIn = {loggedIn} cartItems = {cartItems} setCartItems={setCartItems} cart = {cart} setCart = {setCart}/> 
        </div>: null}
        <div className='grid-product-page-container'>
        <div className="image-container">
            <img src= {selectedProduct.image_url}/>
        </div>
        <div className="product-container-page">
            <h3 className='product-name-page'>{selectedProduct.product_name}</h3>
            <p className = "price-text">{`$${selectedProduct.price}`}</p>
            <button onClick = {onClickHandler} className = "add-to-cart-button">ADD TO CART</button>
            <p className = "description-header">Description</p>
            <p className="product-description-text">{selectedProduct.product_description}</p>
        </div>
        </div>
    </div>
    )
}

export default ProductPage;