import Category from "../../components/Category/Category";
import {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import './categories.css'
import axios from 'axios';
function Categories({filterCategory, setFilterCategory}) {
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()
    const baseURL = process.env.REACT_APP_API_URL;
    useEffect(() => {
        axios.get(`${baseURL}/products/categories`).then(res => {
            const categories = res.data

            setCategories(categories)
        })


    }, [filterCategory])
    const onClickHandler = (e) =>{
      e.preventDefault()
      setFilterCategory(e.target.textContent)
      navigate('/')
      
    }

    return (
      <div className="categories">
        <h3 className = "all-category" onClick = {onClickHandler}>All</h3>
        {categories.map((category) => {
        
            return <Category key = {category.category} category = {category} setFilterCategory = {setFilterCategory}/>
        })}
        
        
      </div>
    );
  }
  export default Categories;