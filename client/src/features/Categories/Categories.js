import Category from "../../components/Category/Category";
import {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import './categories.css'
import axios from 'axios';
function Categories({filterCategory, setFilterCategory}) {
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()
    let key;
    useEffect(() => {
        axios.get("http://localhost:4000/products/categories").then(res => {
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
        
            return <Category key = {key+=1} category = {category} setFilterCategory = {setFilterCategory}/>
        })}
        
        
      </div>
    );
  }
  export default Categories;