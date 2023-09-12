import './App.css';
import { useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProductPage from './features/ProductPage/Productpage';
import MainLayout from './features/MainLayout/MainLayout';
import {v4 as uuidv4} from 'uuid';
import { CartProviderPopUp } from './features/Cart/CartPopUpContext';
import { SelectedProductProvider } from './features/Products/ProductsContext';
import { CartProvider } from './features/Cart/CartContext';
import Login from './features/Login/Login';
import SignUp from './features/Sign-Up/SignUp';
function App() {
  const [filterCategory, setFilterCategory] = useState('All') //to filter products by category
  const [loggedIn, setLoggedIn]  =useState(false); //to be passed into login page to authenticate user
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
  <CartProviderPopUp>
    <SelectedProductProvider>
      <CartProvider>
  <Router>
    <Routes>
      <Route path="/:product_id/:product_name" element={<ProductPage filterCategory = {filterCategory} setFilterCategory = {setFilterCategory}  userId = {userId}/>} />
      <Route path="/login" element={<Login ilterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />} />
      <Route path="/sign-up" element={<SignUp ilterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />} />
      <Route path="/" element={<MainLayout filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} userId = {userId}/>}/>
    </Routes>
    </Router>
    </CartProvider>
    </SelectedProductProvider>
   </CartProviderPopUp>
</div>
  );
}

export default App;
