import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import Login from '../features/Login/Login';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../features/Cart/CartContext';
import { CartProviderPopUp } from '../features/Cart/CartPopUpContext';
import { ProductsProvider } from '../features/Products/ProductsContext';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { rest } from 'msw';
const baseURL = process.env.REACT_APP_API_URL
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
//mock navigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Use the actual module except for useNavigate
    useNavigate: jest.fn(), // Mock useNavigate
  }));
describe('test if login form and buttons render correctly', () => {
    test("if login header is rendered", () => {
        render(
        <ProductsProvider>
        <CartProviderPopUp>
            <CartProvider>
        <MemoryRouter>
            <Login/>
        </MemoryRouter>
        </CartProvider>
    </CartProviderPopUp>
    </ProductsProvider>
        )

        //check if heading is rendered
        const loginHeading = screen.getByRole('heading', {name: 'Login'})
        expect(loginHeading).toBeInTheDocument()
    })
    test("if form is rendered correctly", () => {
        render(
        <ProductsProvider>
        <CartProviderPopUp>
            <CartProvider>
        <MemoryRouter>
            <Login/>
        </MemoryRouter>
        </CartProvider>
    </CartProviderPopUp>
    </ProductsProvider>
        )

        //check if label is rendered
        const emailLabel= screen.getByLabelText('Email')
        expect(emailLabel).toBeInTheDocument();

        //check if email input is rendered
        const emailInput = screen.getByPlaceholderText('Email...');

        expect(emailInput).toBeInTheDocument();

        //check if password label is rendered
        const passwordLabel= screen.getByLabelText('Password')
        expect(passwordLabel).toBeInTheDocument();

        //check if password input is rendered
        const passwordInput = screen.getByPlaceholderText('Password...');

        expect(passwordInput).toBeInTheDocument();

        //check if Sign In button is rendered
        const signInButton = screen.getByRole('button', {name: 'Sign In'});

        expect(signInButton).toBeInTheDocument();

        //check if create account button is rendered;
        const createAccountButton= screen.getByRole('button', {name: 'Create Account'});

        expect(createAccountButton).toBeInTheDocument();




    })


})

test("if cart component is opened when cart icon is clicked", async() => {
    render(
        <ProductsProvider>
        <CartProviderPopUp>
            <CartProvider>
        <MemoryRouter>
            <Login userId = {'1'}/>
        </MemoryRouter>
        </CartProvider>
    </CartProviderPopUp>
    </ProductsProvider>
        )
        //set up userEvent
    const user = userEvent.setup();

       // Wait for any asynchronous actions to complete
       await waitFor(() => {
        // Initially, the cart should not be in the document
        const cartHeading = screen.queryByText('Cart');
        expect(cartHeading).not.toBeInTheDocument();
    
        // Get cart logo
        const cartLogo = screen.getByText('shopping_bag');
    
        // Click cart logo to open the cart
        user.click(cartLogo);
        
        
      });
      await waitFor(() => {
          const cartHeading = screen.getByText('Cart');
          expect(cartHeading).toBeInTheDocument();
          //find close button
          const closeButton  = screen.getByText('close');
          user.click(closeButton)
      })
      
      await waitFor(() => {
          const cartHeading = screen.queryByText('Cart');
          expect(cartHeading).not.toBeInTheDocument();
          
      })
    
})

test('navigation to / called when user successfully signs up', async () => {
    server.use(
        rest.post(`${baseURL}/auth/login`, (req, res, ctx) => {
            return res(ctx.status(200))
        })
    )
    const navigateMock = jest.fn();
    const setLoggedIn = jest.fn()
  
require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
render(
    <ProductsProvider>
    <CartProviderPopUp>
        <CartProvider>
    <MemoryRouter>
        <Login setLoggedIn={setLoggedIn}/>
    </MemoryRouter>
    </CartProvider>
</CartProviderPopUp>
</ProductsProvider>
    )
    //get sing in button
    const signInButton = screen.getByRole('button', {name: 'Sign In'})
    //set up user event
    const user  = userEvent.setup()

    await waitFor(() => {
        user.click(signInButton);
        expect(navigateMock).toHaveBeenCalledWith('/')
        expect(setLoggedIn).toHaveBeenCalledWith(true)

    })



})

test('navigation called with /sign up when create account button is clicked', async () => {

    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
render(
    <ProductsProvider>
    <CartProviderPopUp>
        <CartProvider>
    <MemoryRouter>
        <Login />
    </MemoryRouter>
    </CartProvider>
</CartProviderPopUp>
</ProductsProvider>
    )
    //set up user event
    const user = userEvent.setup()
    //get create account button

    const createAccountButton = screen.getByRole('button', {name: 'Create Account'})

    await waitFor(()=> {
        user.click(createAccountButton);
        expect(navigateMock).toHaveBeenCalledWith('/sign-up')


    })
})