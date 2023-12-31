import './ProductPage.css'
import Header from '../Header/Header';
import Categories from '../Categories/Categories';
import CartPopUp from '../Cart/Cart';
import { useState, useEffect} from 'react';
import axios from 'axios';
import { useSelectedProduct } from '../Products/SelectedProductContext';
import { useParams } from 'react-router-dom';
import { usePopup } from '../Cart/CartPopUpContext';
import { useCart } from '../Cart/CartContext';
function ProductPage({filterCategory, setFilterCategory, userId, loggedIn, setLoggedIn, setUserId}){
    const {cart, setCart} = useCart()
    const {openPopUp, setOpenPopUp} = usePopup()
    const { selectedProduct, setSelectedProduct } = useSelectedProduct();
    const {product_id} = useParams();
    const [loading, setLoading] = useState(false)
    const baseURL = process.env.REACT_APP_API_URL;
    useEffect(() => {
      if(selectedProduct === null || selectedProduct === undefined){
          axios.get(`${baseURL}/products/${product_id}`).then((response) => {
               setLoading(true)
                setSelectedProduct(response.data)
                setLoading(false)
          }).catch((error) => {
            console.log(error)
            setLoading(false)
          })
      }
  
      }, [])
     
    const onClickHandler = (e) => {
        e.preventDefault();
    if(selectedProduct){
        axios.post(`${baseURL}/carts`, {
            user_id: userId,
            product_id: selectedProduct[0].id, quantity: 1
        }).then((response) => {
            setCart([...cart, {
                user_id: userId,
                product_id: selectedProduct[0].id,
                quantity: parseInt(response.data)
            }])
            console.log(response.data)
        })
    }
     
      setOpenPopUp(true)
    }
    if (loading) {
        //render a loading indicator here
        return <p>Loading...</p>;
      }
      if (!selectedProduct) {
        return null; // or render an error message
      }
   
    return(
    <div className = "product-page">
        <Header setOpenPopUp = {setOpenPopUp} loggedIn = {loggedIn} setLoggedIn = {setLoggedIn} setUserId = {setUserId}/>
        <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
        {openPopUp ?
        <div className="cart-container">
         <CartPopUp userId = {userId}/> 
        </div>: null}
        <div className='grid-product-page-container'>
        <div className="image-container">
            <img src= {`../images/${selectedProduct[0].image_url}`} alt={selectedProduct[0].product_name}/>
        </div>
        <div className="product-container-page">
            <h3 className='product-name-page'>{selectedProduct[0].product_name}</h3>
            <p className = "price-text">{`$${selectedProduct[0].price}`}</p>
            <button onClick = {onClickHandler} className = "add-to-cart-button">ADD TO CART</button>
            <p className = "description-header">Description</p>
            <p className="product-description-text">{selectedProduct[0].product_description}</p>
        </div>
        </div>
    </div>
    )
}

export default ProductPage;