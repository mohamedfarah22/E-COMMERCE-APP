import './product.css'
function Product({product}){
    return(
        <div className="product-container">
            
            <img className="product-image" src={product.image_url}/>
            <p className= "product-name">{product.product_name}</p>
        </div>
    )
}

export default Product;