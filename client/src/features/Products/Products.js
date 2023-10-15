import {useEffect} from 'react';
import Product from '../../components/Product/Product';
import axios from 'axios';
import './products.css';
import { useProducts } from './ProductsContext';
function Products({filterCategory}){
    const {products, setProducts} = useProducts()
    const baseURL = process.env.REACT_APP_API_URL;
    useEffect(() => {
        if(filterCategory==='All'){
        axios.get(`${baseURL}products`).then(res => {
            const products = res.data;

            setProducts(products)
        })
    }
    else{
        axios.get(`${baseURL}/products?category=${filterCategory}`).then(res => {
            const products = res.data;

            setProducts(products)
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