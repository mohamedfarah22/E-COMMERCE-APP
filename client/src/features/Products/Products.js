import {useEffect} from 'react';
import Product from '../../components/Product/Product';
import axios from 'axios';
import './products.css';
import { useProducts } from './ProductsContext';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from '../../components/Searchbar/searchContext';
function Products({filterCategory}){
    const {products, setProducts} = useProducts();
    const {searchRoute, setSearchRoute} = useSearchContext()
    const baseURL = process.env.REACT_APP_API_URL;
   const navigate = useNavigate()
    useEffect(() => {
        if(filterCategory==='All' && searchRoute===false){
        axios.get(`${baseURL}/products`).then(res => {
            const products = res.data;

            setProducts(products)

        })
    } if(searchRoute === true){
      setSearchRoute(false)
    }
    
    else if(searchRoute === false && filterCategory!=='All'){
        axios.get(`${baseURL}/products?category=${filterCategory}`).then(res => {
            const products = res.data;

            setProducts(products)
            navigate(`/${filterCategory}`)
        })  
    }
    }, [filterCategory, setProducts])
 
    return (
    <div  className="products">
     
      {products === null ? (
        <p>Loading...</p> // Display a loading message until products are fetched
      ) : (
        products.map((product) => (
          <Product key={product.id} product={product} />
        ))
      )}
    </div>

    )
}

export default Products;