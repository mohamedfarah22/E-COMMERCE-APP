import './App.css';
import { useState,} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProductPage from './features/ProductPage/Productpage';
import MainLayout from './features/MainLayout/MainLayout';
function App() {
  const [filterCategory, setFilterCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
 
  return (
    <div className="App">
  <Router>
    <Routes>
      <Route path="/products/:product_name" element={<ProductPage selectedProduct = {selectedProduct} filterCategory = {filterCategory} setFilterCategory = {setFilterCategory}/>} />
      <Route path="/" element={<MainLayout filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} setSelectedProduct={setSelectedProduct}/>}/>
    </Routes>
   </Router>
    </div>
  );
}

export default App;
