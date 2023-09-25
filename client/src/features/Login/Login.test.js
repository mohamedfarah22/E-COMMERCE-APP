import React from 'react';
import { render, screen} from '@testing-library/react';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../Cart/CartContext';
import { CartProviderPopUp } from '../Cart/CartPopUpContext';
import { ProductsProvider } from '../Products/ProductsContext';

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