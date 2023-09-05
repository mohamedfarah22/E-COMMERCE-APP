import Searchbar from "../../components/Searchbar/Searchbar";
import cartLogo from "../../images/market.png"
import "./Header.css"
import { useNavigate } from "react-router-dom";
function Header({setOpenPopUp}){
    const navigate = useNavigate()

    const onClickHandler = (e) => {
        navigate('/')
    }
    const onClickHandlerCart = (e)=> {
        e.preventDefault()
        setOpenPopUp(true)

    }
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
                <p className = "login-text">Log in</p>
                <img onClick = {onClickHandlerCart} className = "cartLogo" alt="cart logo" src={cartLogo}/>
            </div> 
        </div>
    )

}

export default Header;

