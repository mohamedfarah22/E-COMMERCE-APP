import Header from "../Header/Header";
import Categories from "../Categories/Categories";
import { usePopup } from "../Cart/CartPopUpContext";
import { useState } from "react";
import axios from "axios";
import "./SignUp.css"
function SignUp({filterCategory, setFilterCategory}){
    const {setOpenPopUp} = usePopup;
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
      });
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await axios.post('http://localhost:4000/auth/register', formData);
      
          if (response.status === 201) {
            console.log('Form submission successful');
          } else {
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
        <div className="sign-up-container">
            <form className="sign-up-form" onSubmit = {handleSubmit}>
                <label className = "label" htmlFor="first_name">First Name</label>
                <input className= "text" type="text" id = "first_name" name = "first_name" required value={formData.first_name} onChange = {handleChange}/>
                <label className = "label" htmlFor="last_name">Last Name</label>
                <input className= "text" type="text" id = "last_name" name = "last_name" required value={formData.last_name} onChange = {handleChange}/>
                <label className = "label" htmlFor="email">Email</label>
                <input className= "text" type="text" id = "email" name = "email" required value={formData.email} onChange = {handleChange}/>
                <label className = "label" htmlFor="password">Password</label>
                <input className= "text" type="password" id = "password" name = "password" required value={formData.password} onChange = {handleChange}/>
                <button type="submit" className="create-account-button" >Create Account</button>
            </form>

        </div>
        </div>
    )
}
export default SignUp;