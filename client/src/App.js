import './App.css';
import { useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProductPage from './features/ProductPage/Productpage';
import MainLayout from './features/MainLayout/MainLayout';
import {v4 as uuidv4} from 'uuid';
function App() {
  const [filterCategory, setFilterCategory] = useState('All') //to filter products by category
  const [selectedProduct, setSelectedProduct] = useState(null) //to be rendered on productPage
  const [loggedIn, setLoggedIn]  =useState(false); //to be passed into login page to authenticate user
  const [cartItems, setCartItems] = useState([]); //to add and display items in cart
  const [userId, setUserId] = useState(null)
  
 useEffect(() => {
  if(loggedIn){
    //set user Id to the ID of loggd in user
  } else{
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      const newUserId = uuidv4();
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId)
    }
    
  }
 }, [loggedIn])
  return (
    <div className="App">
  <Router>
    <Routes>
      <Route path="/products/:product_name" element={<ProductPage selectedProduct = {selectedProduct} filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} cartItems = {cartItems} setCartItems={setCartItems} userId = {userId}/>} />
      <Route path="/" element={<MainLayout filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} setSelectedProduct={setSelectedProduct}/>}/>
    </Routes>
   </Router>
    </div>
  );
}

export default App;
