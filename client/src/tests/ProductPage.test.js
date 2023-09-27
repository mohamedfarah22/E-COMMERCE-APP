import ProductPage from "../features/ProductPage/Productpage";
import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import { MemoryRouter, Route, Routes} from 'react-router-dom';
import { CartProvider} from "../features/Cart/CartContext";
import { CartProviderPopUp } from "../features/Cart/CartPopUpContext";
import { SelectedProductProvider } from "../features/Products/SelectedProductContext";
import {setupServer} from 'msw/node';
import {rest} from 'msw';
import { ProductsProvider } from "../features/Products/ProductsContext";
import userEvent from '@testing-library/user-event';
import Login from "../features/Login/Login";
//first intercept on mount call with msw to se selected product
const server = setupServer(
    // Define mock responses for your API endpoints
    rest.get('http://localhost:4000/products/1', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 1,
            product_name: 'Elegant Gold Bangle',
            image_url: 'http://localhost:4001/elegant-gold-bangle',
            product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.',
            price: 1100
          }
        ])
      );
    }),
  
    rest.get('http://localhost:4000/products/categories', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            categories: 'bangles'
          }
        ])
      );
    }),
  
    rest.get('http://localhost:4000/carts/1', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 1,
            user_id: 1,
            product_id: 1,
            quantity: 2,
          }
        ])
      );
    }),
  
    rest.get('http://localhost:4000/carts/cart-total', (req, res, ctx) => {
      // Access query parameters using req.url.searchParams
      const userId = req.url.searchParams.get('user_id');
      
      // Return the response based on the userId
      if (userId === '1') {
        return res(
          ctx.status(200),
          ctx.json([
            {
              total_cost: 1100
            }
          ])
        );
      } 
    })
  );
  
  // Start the MSW server
  beforeAll(() => server.listen());
  
  // Stop the MSW server after the tests
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
         screen.debug()
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
            screen.debug()

        })
    })