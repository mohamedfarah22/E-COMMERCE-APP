import './Category.css'
import { useNavigate } from 'react-router-dom'
function Category({category, setFilterCategory}) {
  const navigate = useNavigate()
  const onClickHandler = (e) =>{
    e.preventDefault()
    setFilterCategory(e.target.textContent)
    navigate('/')
  }

    return (
      <div className="category">
        <h3 onClick = {onClickHandler} className="category-text">{category.category}</h3> 
      </div>
    );
  }
  export default Category;