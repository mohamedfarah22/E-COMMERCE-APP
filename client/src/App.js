import './App.css';
import Header from './features/Header/Header';
import Categories from './features/Categories/Categories';
import Products from './features/Products/Products';
import { useState } from 'react';
function App() {
  const [filterCategory, setFilterCategory] = useState('All')
  return (
    <div className="App">
    <Header />
    <Categories setFilterCategory = {setFilterCategory}/>
    <Products filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
   
    </div>
  );
}

export default App;
