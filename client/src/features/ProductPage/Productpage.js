import './ProductPage.css'
import Header from '../Header/Header';
import Categories from '../Categories/Categories';
import CartPopUp from '../Cart/Cart';
import { useState, useEffect} from 'react';
import axios from 'axios';
function ProductPage({selectedProduct, filterCategory, setFilterCategory, userId}){
    const [openPopUp, setOpenPopUp]  =useState(false);
    const [cart, setCart] = useState([])
    
    const onClickHandler = (e) => {
        e.preventDefault();
        axios.post("http://localhost:4000/carts", {
            user_id: userId,
            product_id: selectedProduct.id, quantity: 1
        }).then((response) => {
            setCart([...cart, {
                user_id: userId,
                product_id: selectedProduct.id,
                quantity: response.data
            }])
            console.log(response.data)
        })
     
     
      setOpenPopUp(true)
    }

   
    return(
    <div>
        <Header setOpenPopUp = {setOpenPopUp}/>
        <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
        {openPopUp ?
        <div className="cart-container">
         <CartPopUp openPopUp = {openPopUp}setOpenPopUp = {setOpenPopUp} cart = {cart} setCart = {setCart} userId = {userId}/> 
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