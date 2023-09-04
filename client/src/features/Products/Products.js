import {useEffect, useState} from 'react';
import Product from '../../components/Product/Product';
import axios from 'axios';
import './products.css'
function Products({filterCategory}){
    const [products, setProducts] = useState([])

    useEffect(() => {
        if(filterCategory==='All'){
        axios.get("http://localhost:4000/products").then(res => {
            const products = res.data;

            setProducts(products)
        })
    }
    else{
        axios.get(`http://localhost:4000/products/?category=${filterCategory}`).then(res => {
            const products = res.data;

            setProducts(products)
        })  
    }
    }, [filterCategory])
    return (
        <div className="products">
            {products.map((product) => {
                return <Product product={product}/>
            })}

        </div>

    )
}

export default Products;