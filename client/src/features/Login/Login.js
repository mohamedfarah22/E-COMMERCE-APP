import Header from "../Header/Header";
import Categories from "../Categories/Categories";
import { usePopup } from "../Cart/CartPopUpContext";
import "./login.css"
function Login({filterCategory, setFilterCategory}){
    const {setOpenPopUp} = usePopup
    return(
        <div className="login-page">
             <Header setOpenPopUp = {setOpenPopUp}/>
             <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
        <div className="login-container">
            <h1 className="login-header">Login</h1>
            <form className="login-form">
                <label className = "label" htmlFor="email">Email</label>
                <input className= "text" type="text" id = "email" name = "email" />
                <label className = "label" htmlFor="email">Password</label>
                <input className= "text" type="text" id = "password" name = "password" />
                <button className="sign-in-button" >Sign In</button>
            </form>
        <div className="create-account-button-container">
            <button className="create-acccount-button">Create Account</button>
         </div>
        </div>
        </div>
    )
}
export default Login;