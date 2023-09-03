import './Category.css'
function Category({category}) {

    return (
      <div className="category">
        <p className="category-text">{category.category}</p>
        
      </div>
    );
  }
  export default Category;