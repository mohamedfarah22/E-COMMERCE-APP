import './ProductPage.css'
import Header from '../Header/Header';
import Categories from '../Categories/Categories';
import CartPopUp from '../Cart/Cart';
import { useState } from 'react';
function ProductPage({selectedProduct, filterCategory, setFilterCategory}){
    const [openPopUp, setOpenPopUp]  =useState(false);
    return(
    <div>
        <Header setOpenPopUp = {setOpenPopUp}/>
        <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
        {openPopUp ?
        <div className="cart-container">
         <CartPopUp /> 
        </div>: null}
        <div className='grid-product-page-container'>
        <div className="image-container">
            <img src= {selectedProduct.image_url}/>
        </div>
        <div className="product-container-page">
            <h3 className='product-name-page'>{selectedProduct.product_name}</h3>
            <p className = "price-text">{`$${selectedProduct.price}`}</p>
            <button className = "add-to-cart-button">ADD TO CART</button>
            <p className = "description-header">Description</p>
            <p className="product-description-text">{selectedProduct.product_description}</p>
        </div>
        </div>
    </div>
    )
}

export default ProductPage;