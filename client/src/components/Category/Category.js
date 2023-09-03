import './Category.css'
function Category({category}) {

    return (
      <div className="category">
        <p>{category.category}</p>
        
      </div>
    );
  }
  export default Category;