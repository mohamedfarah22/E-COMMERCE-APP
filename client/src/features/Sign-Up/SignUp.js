import Header from "../Header/Header";
import Categories from "../Categories/Categories";
import { usePopup } from "../Cart/CartPopUpContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"
import CartPopUp from "../Cart/Cart";
function SignUp({filterCategory, setFilterCategory, userId}){
    const {openPopUp, setOpenPopUp} = usePopup();
    const navigate = useNavigate()
    const baseURL = process.env.REACT_APP_API_URL;
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
      });
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await axios.post(`${baseURL}/auth/register`, formData);
          
          if (response.status === 200) {
            navigate('/login')
          } else {
            console.log(response)
            console.log('Form submission failed');
          }
        } catch (error) {
          console.error('An error occurred:', error);
        }
      };
      //handle change from input and update state
      const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
          });
      }
    return(
        <div className="sign-up-page">
             <Header setOpenPopUp = {setOpenPopUp}/>
             <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
             {openPopUp ?
        <div className="cart-container">
         <CartPopUp userId={userId} /> 
        </div>: null}
        <div className="sign-up-container">
            <form className="sign-up-form" onSubmit = {handleSubmit}>
                <label className = "label" htmlFor="first_name">First Name</label>
                <input className= "text" type="text" id = "first_name" name = "first_name" required value={formData.first_name} onChange = {handleChange} placeholder="First Name..."/>
                <label className = "label" htmlFor="last_name">Last Name</label>
                <input className= "text" type="text" id = "last_name" name = "last_name" required value={formData.last_name} onChange = {handleChange} placeholder="Last Name..."/>
                <label className = "label" htmlFor="email">Email</label>
                <input className= "text" type="text" id = "email" name = "email" required value={formData.email} onChange = {handleChange}  placeholder="Email..."/>
                <label className = "label" htmlFor="password">Password</label>
                <input className= "text" type="password" id = "password" name = "password" required value={formData.password} onChange = {handleChange} placeholder="Password..."/>
                <button type="submit" className="create-account-button" >Create Account</button>
            </form>

        </div>
        </div>
    )
}
export default SignUp;