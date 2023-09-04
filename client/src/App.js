import './App.css';
import Header from './features/Header/Header';
import Categories from './features/Categories/Categories';
import Products from './features/Products/Products';
import { useState,} from 'react';
function App() {
  const [filterCategory, setFilterCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
 
  return (
    <div className="App">
    <Header />
    <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory}/>
    <Products filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} setSelectedProduct = {setSelectedProduct}/>
   
    </div>
  );
}

export default App;
