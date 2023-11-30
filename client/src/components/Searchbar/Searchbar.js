import './Searchbar.css';
import searchButton from "../../images/searchButton.png"
import {useState} from 'react';
import axios from 'axios';
import { useProducts } from '../../features/Products/ProductsContext';
import { useNavigate } from "react-router-dom";
import { useSearchContext } from './searchContext';
const baseURL = process.env.REACT_APP_API_URL;
function Searchbar (){
    const [searchPhrase, setSearchPhrase] = useState('');
    const {setProducts} = useProducts();
    const {setSearchRoute} = useSearchContext()
    const navigate = useNavigate()
    const handleChange = (e) => {
        e.preventDefault();
        setSearchPhrase(e.target.value)
        

    }


    const handleClick = (e) => {
        e.preventDefault();
        axios.get(`${baseURL}/search?query=${searchPhrase}`)
          .then((response) => {
            const newProducts = response.data.map((product) => {
              const {_id, _source} = product
              return {id: _id, ..._source}
            });
            setProducts(newProducts);
            setSearchRoute(true)
            navigate(`/search?q=${searchPhrase}`)
            
          })
          .catch((error) => {
            console.error('Error fetching products:', error);
          });
    }
    

    return (

    <div className="SearchBar">
        <input className="input" type="text" placeholder="Search..." aria-label="Search..." onChange = {handleChange}/>
       <button  className="search-button" ><img src={searchButton} alt="search button"className="search-image" onClick= {handleClick} /> </button>
    </div>

    )
}

export default Searchbar;