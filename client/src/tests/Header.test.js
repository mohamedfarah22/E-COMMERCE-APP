import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import Header from '../features/Header/Header.js';
import { MemoryRouter } from 'react-router-dom';
import { CartProviderPopUp } from '../features/Cart/CartPopUpContext.js';
import { CartProvider } from '../features/Cart/CartContext.js';
import { ProductsProvider } from '../features/Products/ProductsContext.js';
import { cartQuantityCalculator } from '../features/Header/HeaderHelperFunctions.js';
import '@testing-library/jest-dom';
import { server } from './mocks/server';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
//mock navigte
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Use the actual module except for useNavigate
  useNavigate: jest.fn(), // Mock useNavigate
}));
describe('Header component initial render' , () =>{

test('renders Header with correct text in banner, company name and log in text', () => {
  render(

  <MemoryRouter>
    <CartProviderPopUp>
      <CartProvider>
        <ProductsProvider>
          <Header/>
        </ProductsProvider>
      </CartProvider>
    </CartProviderPopUp>
  </MemoryRouter>
  );
  
  expect(screen.getByText('Shop Online | Discover Luxuria')).toBeInTheDocument();
  expect(screen.getByText('Luxuria')).toBeInTheDocument();
  expect(screen.getByText('Log In')).toBeInTheDocument();
  });

 
 
    test('if cart quantity is rendered', () => {
    
      render(
    
      <MemoryRouter>
        <CartProviderPopUp>
          <CartProvider>
            <ProductsProvider>
              <Header/>
            </ProductsProvider>
          </CartProvider>
        </CartProviderPopUp>
      </MemoryRouter>
      );
      const cartQuantityElement = screen.getByText("0");
      expect(cartQuantityElement).toBeInTheDocument();
    
      });



      test('if cart logo is rendered', () => {
    
        render(
      
        <MemoryRouter>
          <CartProviderPopUp>
            <CartProvider>
              <ProductsProvider>
                <Header/>
              </ProductsProvider>
            </CartProvider>
          </CartProviderPopUp>
        </MemoryRouter>
        );
    
        expect(screen.getByText('shopping_bag')).toBeInTheDocument();
      
        }); 
    
        test('if banner background color is rendered correctly', async() => {
    
         render(
        
          <MemoryRouter>
            <CartProviderPopUp>
              <CartProvider>
                <ProductsProvider>
                  <Header/>
                </ProductsProvider>
              </CartProvider>
            </CartProviderPopUp>
          </MemoryRouter>
          );
          const shoppingBannerPElement = screen.getByText('Shop Online | Discover Luxuria');

          const divContainer = shoppingBannerPElement.parentElement

          expect(divContainer).toHaveStyle('background-color: rgb(133, 93, 213,1)')
         })
         test("if cart quantity calculator helper function works correctly", () => {
          const cartQuantity  = cartQuantityCalculator([{id: 1, product: 'product 1'}, {id: 2, product: 'product 3'}, {id: 3, product: 'product 4'}])

          expect(cartQuantity).toBe(cartQuantity)

         })
         
        }) 

  //test luxuria navigation
 test('luxuria heading navigates to home/dashboard', async () => {
  const navigateMock = jest.fn();
    
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
  render(
        
    <MemoryRouter>
      <CartProviderPopUp>
        <CartProvider>
          <ProductsProvider>
            <Header />
          </ProductsProvider>
        </CartProvider>
      </CartProviderPopUp>
    </MemoryRouter>
    );  

    //set up user events
    const user = userEvent.setup();
   await  waitFor(() => {
       //find heading
    const luxuriaHeading = screen.getByRole('heading', {name: 'Luxuria'})

    //click heading
    user.click(luxuriaHeading);

    //navigate called with /
    expect(navigateMock).toHaveBeenCalledWith('/')
    })
   
 })
  //test login navigation
test('on click login navigates to login page', async () => {
  const navigateMock = jest.fn();
    
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
  render(
        
    <MemoryRouter>
      <CartProviderPopUp>
        <CartProvider>
          <ProductsProvider>
            <Header />
          </ProductsProvider>
        </CartProvider>
      </CartProviderPopUp>
    </MemoryRouter>
    );  
    const user = userEvent.setup();
   await  waitFor(() => {
       //find log in text
    const logInText= screen.getByText('Log In')

    //click heading
    user.click(logInText);

    //navigate called with /
    expect(navigateMock).toHaveBeenCalledWith('/login')
    })
})
  //test log out navigation
  test('on click logout navigates to login page', async () => {
    server.use(
      rest.post('http://localhost:4000/auth/logout', (req, res, ctx) => {
          return res(ctx.status(200))
      })
  )
    const navigateMock = jest.fn();
    const setLoggedIn = jest.fn()
      
      require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
    render(
          
      <MemoryRouter>
        <CartProviderPopUp>
          <CartProvider>
            <ProductsProvider>
              <Header loggedIn = {true} setLoggedIn={setLoggedIn}/>
            </ProductsProvider>
          </CartProvider>
        </CartProviderPopUp>
      </MemoryRouter>
      );  
      const user = userEvent.setup();
     await  waitFor(() => {
         //find log in text
      const logOutText= screen.getByText('Log Out')
  
      //click heading
      user.click(logOutText);
  
      //navigate called with /login
      expect(navigateMock).toHaveBeenCalledWith('/login');
      //logged in set to false
      expect(setLoggedIn).toHaveBeenCalledWith(false)
      })
  })
  