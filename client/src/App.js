import './App.css';
import { useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProductPage from './features/ProductPage/Productpage';
import MainLayout from './features/MainLayout/MainLayout';
import {v4 as uuidv4} from 'uuid';
import { CartProviderPopUp } from './features/Cart/CartPopUpContext';
import { SelectedProductProvider } from './features/Products/SelectedProductContext';
import { CartProvider } from './features/Cart/CartContext';
import Login from './features/Login/Login';
import SignUp from './features/Sign-Up/SignUp';
import Chatbot from './features/Chatbot/Chatbot';
import { ProductsProvider } from './features/Products/ProductsContext';
function App() {
  const [filterCategory, setFilterCategory] = useState('All') //to filter products by category
  const [loggedIn, setLoggedIn]  =useState(false); //to be passed into login page to authenticate user
  const [userId, setUserId] = useState(null);

  
  
 useEffect(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if(loggedIn || isLoggedIn){
 setUserId(localStorage.getItem('userId'))
  }
  else {
      const newUserId = uuidv4();
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId)
    
    
  }
 }, [loggedIn])
  return (
<div className="App">
  <CartProviderPopUp>
    <SelectedProductProvider>
      <CartProvider>
        <ProductsProvider>
  <Router>
    <Routes>
      <Route path="/:product_id/:product_name" element={<ProductPage filterCategory = {filterCategory} setFilterCategory = {setFilterCategory}  userId = {userId} loggedIn = {loggedIn} setLoggedIn = {setLoggedIn}/>} />
      <Route path="/login" element={<Login filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} setLoggedIn = {setLoggedIn} userId={userId} loggedIn = {loggedIn}/>} />
      <Route path="/sign-up" element={<SignUp filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} userId={userId}/>} />
      <Route path="/" element={<MainLayout filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} userId = {userId} loggedIn = {loggedIn} setLoggedIn = {setLoggedIn} setUserId = {setUserId}/>}/>
    </Routes>
    </Router>
    <Chatbot/>
 
    </ProductsProvider>
    </CartProvider>
    </SelectedProductProvider>
   </CartProviderPopUp>
</div>
  );
}

export default App;
