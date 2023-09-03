import './Searchbar.css';
import searchButton from "../../images/searchButton.png"
function Searchbar (){

    return (

    <form className="SearchBar">
        <input className="input" type="text" placeholder="Search" aria-label="Search"/>
        <img src={searchButton} alt="search button" className="search-button"/>
    </form>

    )
}

export default Searchbar;