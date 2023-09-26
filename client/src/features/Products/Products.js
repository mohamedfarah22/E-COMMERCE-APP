import {useEffect, useState} from 'react';
import Product from '../../components/Product/Product';
import axios from 'axios';
import './products.css';
import { useProducts } from './ProductsContext';
function Products({filterCategory}){
    const {products, setProducts} = useProducts()

    useEffect(() => {
        if(filterCategory==='All'){
        axios.get("http://localhost:4000/products").then(res => {
            const products = res.data;

            setProducts(products)
        })
    }
    else{
        axios.get(`http://localhost:4000/products?category=${filterCategory}`).then(res => {
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