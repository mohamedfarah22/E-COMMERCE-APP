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
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
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