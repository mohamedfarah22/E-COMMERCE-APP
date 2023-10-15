import './Searchbar.css';
import searchButton from "../../images/searchButton.png"
import {useState} from 'react';
import axios from 'axios';
import { useProducts } from '../../features/Products/ProductsContext';
function Searchbar (){
    const [searchPhrase, setSearchPhrase] = useState('');
    const {setProducts} = useProducts();
    const handleChange = (e) => {
        e.preventDefault();
        setSearchPhrase(e.target.value)

    }
    const handleClick = (e) => {
        e.preventDefault();
        axios.get(`http://localhost:4000/search?q=${searchPhrase}`)
          .then((response) => {
            const newProducts = response.data.map((product) => product["_source"]);
            setProducts(newProducts);
          })
          .catch((error) => {
            console.error('Error fetching products:', error);
          });
    }
    

    return (

    <div className="SearchBar">
        <input className="input" type="text" placeholder="Search..." aria-label="Search..." onChange = {handleChange}/>
       <button  className="search-button" ><img src={searchButton} alt="search button"className="search-image" /> </button>
    </div>

    )
}

export default Searchbar;