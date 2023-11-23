import Searchbar from "../../components/Searchbar/Searchbar";
import "./Header.css"
import { useNavigate } from "react-router-dom";
import { usePopup } from '../Cart/CartPopUpContext';
import { useCart } from "../Cart/CartContext";
import axios from "axios";
import { useEffect, useState } from "react";
import {cartQuantityCalculator}from "./HeaderHelperFunctions";
function Header({loggedIn, setLoggedIn, setSearchRoute}){
    const navigate = useNavigate()
    const {setOpenPopUp} = usePopup()
    const {cart} = useCart();
    const [cartQuantity, setCartQuantity] = useState();
    const baseURL = process.env.REACT_APP_API_URL;
    const onClickHandler = (e) => {
        e.preventDefault()
        navigate('/')
    }
    const onClickHandlerLogin = (e) => {
        e.preventDefault()
        navigate('/login')
    }
    const onClickHandlerLogOut = async (e) => {
        e.preventDefault()
        localStorage.removeItem('isLoggedIn');
        const response  = await axios.post(`${baseURL}/auth/logout`);
        if(response.status === 200){
        setLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        navigate('/login')
        }
    }
    const onClickHandlerCart = (e)=> {
        e.preventDefault()
        setOpenPopUp(true)

    }

    useEffect(() => {
       setCartQuantity(cartQuantityCalculator(cart))


    }, [cart])
    return(

        <div className='header-container'>
            <div className="shop-online-banner">
                <p className='banner-text'>Shop Online | Discover Luxuria</p>
            </div>
            <div onClick = {onClickHandler} className="companyNameContainer">
                <h1 className="companyName">Luxuria</h1> 
            </div>
           < div className="cart-log-search-container">
            <div className="search-container">
                <Searchbar mmit  = {setSearchRoute}/>
            </div>
            {loggedIn ?
                <p className = "login-text" onClick={onClickHandlerLogOut}>Log Out</p>
                :  <p className = "login-text" onClick={onClickHandlerLogin}>Log In</p>
            }
                <button className="cart-button" onClick = {onClickHandlerCart}>
                <span className="material-symbols-outlined">
                shopping_bag
                 </span>
                <span className="cart-count">{cartQuantity}</span>
                </button>

            </div> 
        </div>
    )

}

export default Header;

