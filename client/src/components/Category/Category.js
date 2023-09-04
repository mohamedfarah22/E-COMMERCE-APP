import './Category.css'
function Category({category, setFilterCategory}) {
  const onClickHandler = (e) =>{
    e.preventDefault()
    setFilterCategory(e.target.textContent)
  }

    return (
      <div className="category">
        <h3 onClick = {onClickHandler} className="category-text">{category.category}</h3> 
      </div>
    );
  }
  export default Category;