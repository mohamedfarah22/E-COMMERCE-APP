import Header from "../Header/Header";
import Categories from "../Categories/Categories";
import Products from "../Products/Products";
import CartPopUp from "../Cart/Cart";
import { usePopup } from '../Cart/CartPopUpContext';
import { useEffect } from "react";

function MainLayout({filterCategory,  setFilterCategory, userId, loggedIn, setLoggedIn, setUserId}){
    const {openPopUp, setOpenPopUp }= usePopup();
    useEffect(() =>{
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        setLoggedIn(isLoggedIn)

        if(isLoggedIn){
           setUserId(localStorage.getItem('userId'))
        }
    
    }, [])
    return(
    <div className="main-layout-container">
        <Header setOpenPopup = {setOpenPopUp} loggedIn = {loggedIn} setLoggedIn = {setLoggedIn} setUserId = {setUserId} />
        <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
        {openPopUp ?
        <div className="cart-container">
         <CartPopUp userId={userId} /> 
        </div>: null}
        <Products filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
    </div>
    )
}

export default MainLayout;