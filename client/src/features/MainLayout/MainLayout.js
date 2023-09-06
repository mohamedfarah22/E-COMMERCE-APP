import Header from "../Header/Header";
import Categories from "../Categories/Categories";
import Products from "../Products/Products";
import CartPopUp from "../Cart/Cart";
import { useState } from "react";
function MainLayout({filterCategory,  setFilterCategory, setSelectedProduct}){
    const [openPopUp, setOpenPopUp] = useState(false);
    return(
    <div classname="main-layout-container">
        <Header setOpenPopup = {setOpenPopUp} />
        <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
        {openPopUp ?
        <div className="cart-container">
         <CartPopUp /> 
        </div>: null}
        <Products filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} setSelectedProduct={setSelectedProduct} />
    </div>
    )
}

export default MainLayout;