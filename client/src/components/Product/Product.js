import './product.css'
function Product({product, setSelectedProduct}){

const onClickHandler = (e)=>{
    e.preventDefault()
    setSelectedProduct(product)
}

    return(
        <div className="product-container" onClick = {onClickHandler}>
            
            <img className="product-image" src={product.image_url}/>
            <p className= "product-name">{product.product_name}</p>
        </div>
    )
}

export default Product;