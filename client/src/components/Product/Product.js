import './product.css';
import { useNavigate } from 'react-router-dom';
//import selectedProductProvider
import { useSelectedProduct } from '../../features/Products/SelectedProductContext';
function Product({product}){
const navigate = useNavigate()
const { setSelectedProduct} = useSelectedProduct();
const onClickHandler = (e)=>{
    e.preventDefault()
    setSelectedProduct([product])
    const productName = product.product_name.split(' ').join('-');
    navigate(`/${product.id}/${productName}`)
}

    return(
        <div className="product-container" onClick = {onClickHandler}>
            
            <img className="product-image" alt={product.product_name} src={product.image_url}/>
            <p className= "product-name">{product.product_name}</p>
        </div>
    )
}

export default Product;