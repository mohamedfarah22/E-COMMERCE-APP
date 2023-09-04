import './product.css';
import { useNavigate } from 'react-router-dom';
function Product({product, setSelectedProduct}){
const navigate = useNavigate()
const onClickHandler = (e)=>{
    e.preventDefault()
    setSelectedProduct(product)
    const productName = product.product_name.split(' ').join('-');
    navigate(`/products/${productName}`)
}

    return(
        <div className="product-container" onClick = {onClickHandler}>
            
            <img className="product-image" src={product.image_url}/>
            <p className= "product-name">{product.product_name}</p>
        </div>
    )
}

export default Product;