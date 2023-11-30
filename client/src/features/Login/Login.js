import Header from "../Header/Header";
import Categories from "../Categories/Categories";
import { usePopup } from "../Cart/CartPopUpContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CartPopUp from "../Cart/Cart";
import axios from "axios";
import "./login.css"
function Login({filterCategory, setFilterCategory, userId, setLoggedIn}){
    const {openPopUp, setOpenPopUp} = usePopup()
    const [logInFailed, setLogInFailed] = useState(false)
    const baseURL = process.env.REACT_APP_API_URL;
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
    const navigate = useNavigate();
    const onClickHandler = (e) => {
        e.preventDefault();
        navigate('/sign-up')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${baseURL}/auth/login`, formData);
        
            if (response.status === 200) {
             const userId = response.data.user;
             const tokens = response.data.tokens
             localStorage.setItem('userId', userId);
             localStorage.setItem('accessToken', tokens.accessToken);
             localStorage.setItem('idToken', tokens.idToken);
             localStorage.setItem('refreshToken', tokens.refreshToken);
             setLoggedIn(true);
             localStorage.setItem('isLoggedIn', 'true');
             navigate('/')
            }
            
          } catch (error) {
            setLogInFailed(true);
            console.error('An error occurred:', error);
          }
        };

        const handleChange = (e) => {
            const {name, value} = e.target;
            setFormData({
                ...formData,
                [name]: value,
              });
          }
    return(
        <div className="login-page">
             <Header setOpenPopUp = {setOpenPopUp} setLoggedIn = {setLoggedIn}/>
             <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
             {openPopUp ?
        <div className="cart-container">
         <CartPopUp userId={userId} /> 
        </div>: null}
        <div className="login-container">
            <h1 className="login-header">Login</h1>
            <form className="login-form" onSubmit = {handleSubmit}>
                <label className = "label" htmlFor="email">Email</label>
                <input className= "text" type="text" id = "email" name = "email" required value={formData.email} onChange = {handleChange} placeholder="Email..."/>
                <label className = "label" htmlFor="email">Password</label>
                <input className= "text" type="password" id = "password" name = "password" required value={formData.password} onChange = {handleChange} placeholder="Password..." pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."/>
                <button className="sign-in-button" >Sign In</button>
                {logInFailed ?  <p className='InvalidUsePw'>Invalid email or password</p>:null}
            </form>
        <div className="create-account-button-container">
            <button onClick = {onClickHandler}className="create-acccount-button">Create Account</button>
         </div>
        </div>
        </div>
    )
}
export default Login;