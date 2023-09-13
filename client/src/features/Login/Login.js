import Header from "../Header/Header";
import Categories from "../Categories/Categories";
import { usePopup } from "../Cart/CartPopUpContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./login.css"
function Login({filterCategory, setFilterCategory, setUserId, setLoggedIn}){
    const {setOpenPopUp} = usePopup

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
            const response = await axios.post('http://localhost:4000/auth/login', formData);
        
            if (response.status === 200) {
             const userId = response.data.user;
             localStorage.setItem('userId', userId);
             setLoggedIn(true);
             localStorage.setItem('isLoggedIn', 'true');
             navigate('/')
              console.log('login successful');
            } else {
              console.log('login failed');
            }
          } catch (error) {
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
             <Header setOpenPopUp = {setOpenPopUp} setLoggedin = {setLoggedIn}/>
             <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
        <div className="login-container">
            <h1 className="login-header">Login</h1>
            <form className="login-form" onSubmit = {handleSubmit}>
                <label className = "label" htmlFor="email">Email</label>
                <input className= "text" type="text" id = "email" name = "email" required value={formData.email} onChange = {handleChange}/>
                <label className = "label" htmlFor="email">Password</label>
                <input className= "text" type="password" id = "password" name = "password" required value={formData.password} onChange = {handleChange} />
                <button className="sign-in-button" >Sign In</button>
            </form>
        <div className="create-account-button-container">
            <button onClick = {onClickHandler}className="create-acccount-button">Create Account</button>
         </div>
        </div>
        </div>
    )
}
export default Login;