import Searchbar from "../../components/Searchbar/Searchbar";
import cartLogo from "../../images/market.png"
import "./Header.css"
import { useNavigate } from "react-router-dom";
import { usePopup } from '../Cart/CartPopUpContext';
import axios from "axios";
function Header({loggedIn, setLoggedIn, setUserId}){
    const navigate = useNavigate()
    const {setOpenPopUp} = usePopup()

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
                <img onClick = {onClickHandlerCart} className = "cartLogo" alt="cart logo" src={cartLogo}/>
            </div> 
        </div>
    )

}

export default Header;

