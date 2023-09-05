import Header from "../Header/Header";
import Categories from "../Categories/Categories";
import Products from "../Products/Products";
function MainLayout({filterCategory,  setFilterCategory, setSelectedProduct}){
    return(
    <div classname="main-layout-container">
        <Header />
        <Categories filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} />
        <Products filterCategory = {filterCategory} setFilterCategory = {setFilterCategory} setSelectedProduct={setSelectedProduct} />
    </div>
    )
}

export default MainLayout;