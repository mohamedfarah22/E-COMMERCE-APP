import './cart.css';
import closeLogo from '../../images/close-logo.png'
function CartPopUp({setOpenPopUp}){
    const onClickHandler = (e) => {
        e.preventDefault();
        setOpenPopUp(false)


    }
    return (
        <div classname="popup-container">
        <div className="popup-body">
        <div classname="close-text-container" onClick = {onClickHandler}>
        <span class="material-icons">
            close
        </span>
        </div>
            <h1>cart is open</h1>
           
        </div>

        </div>

    )
}

export default CartPopUp;