import Searchbar from "../../components/Searchbar/Searchbar";
import cartLogo from "../../images/market.png"
import "./Header.css"
import { useNavigate } from "react-router-dom";
import { usePopup } from '../Cart/CartPopUpContext';
import { useCart } from "../Cart/CartContext";
import axios from "axios";
import { useEffect, useState } from "react";
function Header({loggedIn, setLoggedIn, setUserId}){
    const navigate = useNavigate()
    const {setOpenPopUp} = usePopup()
    const {cart} = useCart();
    const [cartQuantity, setCartQuantity] = useState();

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
        const response  = await axios.post("http://localhost:4000/auth/logout");
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
    //function to calculate number of items in cart
    const cartQuantityCalculator = (cart) => {
        return cart.length;
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
                <Searchbar />
            </div>
            {loggedIn ?
                <p className = "login-text" onClick={onClickHandlerLogOut}>Log Out</p>
                :  <p className = "login-text" onClick={onClickHandlerLogin}>Log In</p>
            }
                <button class="cart-button" onClick = {onClickHandlerCart}>
                <span class="material-symbols-outlined">
                shopping_bag
                 </span>
                <span class="cart-count">{cartQuantity}</span>
                </button>

            </div> 
        </div>
    )

}

export default Header;

