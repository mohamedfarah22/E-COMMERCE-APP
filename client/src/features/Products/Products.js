import {useEffect, useState} from 'react';
import axios from 'axios';
function Products(){
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get("http://localhost:4000/products").then(res => {
            const products = res.data;

            setProducts(products)
        })
    }, [products])
    return (
        <div className="products">
            

        </div>

    )
}

export default Products;