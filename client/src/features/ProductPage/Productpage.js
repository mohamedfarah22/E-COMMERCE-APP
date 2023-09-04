function ProductPage({selectedProduct}){
    return(
        <div className='grid-product-page-container'>
            <img src= {selectedProduct.image_url}/>
       
            <h3>{selectedProduct.product_name}</h3>
            <p>{selectedProduct.product_description}</p>

        </div>
    )
}

export default ProductPage;