import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import Login from '../features/Login/Login';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../features/Cart/CartContext';
import { CartProviderPopUp } from '../features/Cart/CartPopUpContext';
import { ProductsProvider } from '../features/Products/ProductsContext';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
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
            <Login/>
        </MemoryRouter>
        </CartProvider>
    </CartProviderPopUp>
    </ProductsProvider>
        )
        //set up userEvent
    const user = userEvent.setup();

        //find cart icon;
        const cartIcon = screen.getByRole('button', {name:/shopping_bag/});
        waitFor(() => {
            user.click(cartIcon) 
            //check if cart component is open
            const cartComponent = screen.getByRole('heading', {name: 'Cart'});
            expect(cartComponent).toBeInTheDocument()
        })
    
})