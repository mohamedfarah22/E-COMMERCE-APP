import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import SignUp from '../features/Sign-Up/SignUp';
import { MemoryRouter } from 'react-router-dom';
import { CartProviderPopUp } from '../features/Cart/CartPopUpContext';
import { CartProvider } from '../features/Cart/CartContext';
import { ProductsProvider } from '../features/Products/ProductsContext';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { server } from './mocks/server';
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
test("sign up form rendered correctly", () => {

    render(
<ProductsProvider>
<CartProvider>
<CartProviderPopUp>
<MemoryRouter>
    <SignUp/>
</MemoryRouter>
</CartProviderPopUp>
</CartProvider>
</ProductsProvider>)
    //check if first name label and input are correctly rendered in sign up form
    const firstNameLabel = screen.getByLabelText('First Name');

    expect(firstNameLabel).toBeInTheDocument();

    const firstNameInput = screen.getByPlaceholderText('First Name...')
    expect(firstNameInput).toBeInTheDocument()
     //check if last name label and input are correctly rendered in sign up form
     const lastNameLabel = screen.getByLabelText('Last Name');

     expect(lastNameLabel).toBeInTheDocument();
        
     const lastNameInput = screen.getByPlaceholderText('Last Name...');
     expect(lastNameInput).toBeInTheDocument()
      //check if Email name label and input are correctly rendered in sign up form
      const emailLabel= screen.getByLabelText('Email');

      expect(emailLabel).toBeInTheDocument();
  
      const emailInput = screen.getByPlaceholderText('Email...')
      expect(emailInput).toBeInTheDocument()

      //check if password label and input are correctly rendered in sign up form
      const passwordLabel= screen.getByLabelText('Password');

      expect(passwordLabel).toBeInTheDocument();
  
      const passwordInput = screen.getByPlaceholderText('Password...')
      expect(passwordInput).toBeInTheDocument()

      //check if create account button rendered correctly

      const createAccountButton = screen.getByRole('button', {name: 'Create Account'})

      expect(createAccountButton).toBeInTheDocument()

})

test("cart pop up is open when cart icon is clicked on", async() => {
    //render

    render(
        <ProductsProvider>
        <CartProvider>
        <CartProviderPopUp>
        <MemoryRouter>
            <SignUp userId = {'1'}/>
        </MemoryRouter>
        </CartProviderPopUp>
        </CartProvider>
        </ProductsProvider>)

        //set up user event to simulate user action
        const user = userEvent.setup();

        //find cart icon;
        const cartIcon = screen.getByRole('button', {name:/shopping_bag/});
        await waitFor(() => {
            user.click(cartIcon) 
            //check if cart component is open
            const cartComponent = screen.getByRole('heading', {name: 'Cart'});
            expect(cartComponent).toBeInTheDocument()
        })
       

})






test('navigate called on sign up form after successful registration', async() => {
    server.use(
        rest.post('http://localhost:4000/auth/register', (req, res, ctx) => {
            return res(ctx.status(201))
        })
    )
    const navigateMock = jest.fn();
    
require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
   render(
    <ProductsProvider>
    <CartProvider>
    <CartProviderPopUp>
    <MemoryRouter>
        <SignUp userId = {'1'}/>
    </MemoryRouter>
    </CartProviderPopUp>
    </CartProvider>
    </ProductsProvider>)


const user = userEvent.setup()


await waitFor(() => {
    const signUpButton  = screen.getByRole('button', {name: 'Create Account'})
    user.click(signUpButton)
    expect(navigateMock).toHaveBeenCalledWith('/login')
})

})

//test navigate not called on sign up for failed registration
test('navigate not called on sign up form after failed registration', async() => {
    server.use(
        rest.post('http://localhost:4000/auth/register', (req, res, ctx) => {
            return res(ctx.status(404))
        })
    )
    const navigateMock = jest.fn();
    
require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
   render(
    <ProductsProvider>
    <CartProvider>
    <CartProviderPopUp>
    <MemoryRouter>
        <SignUp userId = {'1'}/>
    </MemoryRouter>
    </CartProviderPopUp>
    </CartProvider>
    </ProductsProvider>)


const user = userEvent.setup()


await waitFor(() => {
    const signUpButton  = screen.getByRole('button', {name: 'Create Account'})
    user.click(signUpButton)
    expect(navigateMock).not.toHaveBeenCalled()
})

})

//test all textboxes have style when create account button is clicked 