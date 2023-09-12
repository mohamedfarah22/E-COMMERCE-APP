import Header from "../Header/Header";
import Categories from "../Categories/Categories";
import { usePopup } from "../Cart/CartPopUpContext";
import "./SignUp.css"
function SignUp({filterCategory, setFilterCategory}){
    const {setOpenPopUp} = usePopup
    return(
        <div className="sign-up-page">
             <Header setOpenPopUp = {setOpenPopUp}/>
             <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
        <div className="sign-up-container">
            <form className="login-form">
                <label className = "label" htmlFor="email">First Name</label>
                <input className= "text" type="text" id = "email" name = "email" />
                <label className = "label" htmlFor="email">Last Name</label>
                <input className= "text" type="text" id = "password" name = "password" />
                <label className = "label" htmlFor="email">Email</label>
                <input className= "text" type="text" id = "email" name = "email" />
                <label className = "label" htmlFor="email">Password</label>
                <input className= "text" type="text" id = "password" name = "password" />
                <button className="create-account-button" >Create Account</button>
            </form>

        </div>
        </div>
    )
}
export default SignUp;