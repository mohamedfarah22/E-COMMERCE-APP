import ProductPage from "../features/ProductPage/Productpage";
import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import { MemoryRouter, Route, Routes} from 'react-router-dom';
import { CartProvider} from "../features/Cart/CartContext";
import { CartProviderPopUp } from "../features/Cart/CartPopUpContext";
import { SelectedProductProvider } from "../features/Products/SelectedProductContext";
import '@testing-library/jest-dom';
import { ProductsProvider } from "../features/Products/ProductsContext";
import userEvent from '@testing-library/user-event';
import Login from "../features/Login/Login";
import { server } from './mocks/server';
//first intercept on mount call with msw to se selected product

beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
test('renders selected product information correctly', async() =>{
    render(
<CartProvider>
    <CartProviderPopUp>
        <ProductsProvider>
        <SelectedProductProvider>
            <MemoryRouter initialEntries = {["/1/Elelgant-Gold-Bangle"]}>
                <Routes>
                <Route path="/:product_id/:product_name"  element={<ProductPage/> }/>
                </Routes>
            </MemoryRouter>
        </SelectedProductProvider>
        </ProductsProvider>

    </CartProviderPopUp>
</CartProvider>)
await waitFor(() => {
    //find product heading
    const productHeading = screen.getByRole('heading', {name: 'Elegant Gold Bangle'})
    expect(productHeading).toBeInTheDocument();
    
    //find product price
    const productPrice = screen.getByText('$1100')
    expect(productPrice).toBeInTheDocument();

   //find add to cart button

   const addToCartButton = screen.getByRole('button', {name: 'ADD TO CART'});
   expect(addToCartButton).toBeInTheDocument()
  
   //product description

   const productDescription = screen.getByText('Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.')
   expect(productDescription).toBeInTheDocument();

   //product image
   const productImage = screen.getByAltText('Elegant Gold Bangle');
   expect(productImage).toBeInTheDocument()
  
   
})
})

//test cart opens
test('cart opened when clicked' , async () => {
    render(
        <CartProvider>
            <CartProviderPopUp>
                <ProductsProvider>
                <SelectedProductProvider>
                    <MemoryRouter initialEntries = {["/1/Elelgant-Gold-Bangle"]}>
                        <Routes>
                        <Route path="/:product_id/:product_name"  element={<ProductPage userId = {1}/> }/>
                        <Route path="/"  element={<Login/> }/>
                        </Routes>
                    </MemoryRouter>
                </SelectedProductProvider>
                </ProductsProvider>
        
            </CartProviderPopUp>
        </CartProvider>)
         //set up user event to simulate user action
         const user = userEvent.setup();

         await waitFor(() => {
            const cartIcon = screen.getByRole('button', {name:/shopping_bag/});
            user.click(cartIcon) 
            const cartComponent = screen.getByRole('heading', {name: 'Cart'});
            expect(cartComponent).toBeInTheDocument()
         })
      
})

//test route to login page

test('test route to login page', async () => {
    render(
        <CartProvider>
            <CartProviderPopUp>
                <ProductsProvider>
                <SelectedProductProvider>
                    <MemoryRouter initialEntries = {["/1/Elelgant-Gold-Bangle"]}>
                        <Routes>
                        <Route path="/:product_id/:product_name"  element={<ProductPage userId = {1}/> }/>
                        <Route path="/login"  element={<Login/> }/>
                        </Routes>
                    </MemoryRouter>
                </SelectedProductProvider>
                </ProductsProvider>
        
            </CartProviderPopUp>
        </CartProvider>
        )
        const user = userEvent.setup();
        await waitFor(() => {
            //get login text
            const logInText = screen.getByText('Log In');
            expect(logInText).toBeInTheDocument();
            
            //click on login text
            user.click(logInText);
            const logInHeading = screen.getByRole('heading', {name: 'Login'})
            expect(logInHeading).toBeInTheDocument();
            
        })
    })