import Header from "../Header/Header";
import Categories from "../Categories/Categories";
import Products from "../Products/Products";
import CartPopUp from "../Cart/Cart";
import { usePopup } from '../Cart/CartPopUpContext';
function MainLayout({filterCategory,  setFilterCategory, userId}){
    const {openPopUp, setOpenPopUp }= usePopup();
    return(
    <div classname="main-layout-container">
        <Header setOpenPopup = {setOpenPopUp} />
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