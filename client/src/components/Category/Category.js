import './Category.css'
function Category({category}) {

    return (
      <div className="category">
        <h3 className="category-text">{category.category}</h3> 
      </div>
    );
  }
  export default Category;