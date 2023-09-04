import './App.css';
import Header from './features/Header/Header';
import Categories from './features/Categories/Categories';
import Products from './features/Products/Products';
import { useState,} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProductPage from './features/ProductPage/Productpage';
function App() {
  const [filterCategory, setFilterCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
 
  return (
    <div className="App">
    <Header />
    <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory}/>
  <Router>
    <Routes>
      <Route path="/products/:product_name" element={<ProductPage selectedProduct = {selectedProduct}/>} />
      <Route path="/" element={<Products filterCategory={filterCategory} setFilterCategory={setFilterCategory} setSelectedProduct={setSelectedProduct} />} />
    </Routes>
   </Router>
    </div>
  );
}

export default App;
