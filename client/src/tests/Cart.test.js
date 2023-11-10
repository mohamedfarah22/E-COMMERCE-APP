import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import CartPopUp from '../features/Cart/Cart';
import { CartProviderPopUp, PopupContext } from '../features/Cart/CartPopUpContext.js';
import { CartProvider } from '../features/Cart/CartContext.js';
import { roundUpToTwoDecimalPlaces } from '../features/Cart/CartHelperFunctions';
import '@testing-library/jest-dom';
import { server } from './mocks/server';
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from 'react-router-dom';


//test helper function

test('test round up 2 decimals helper function', () => {
    const num = 123.4567;
    const roundedNum = roundUpToTwoDecimalPlaces(num);

    expect(roundedNum).toBe(123.46);
})
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
describe('testing that cart products and fixed cart elements rendered in cart pop' , () => {
    test('that fixed elements rendered in cart', async ()=> {
        render(
    <MemoryRouter>
    <CartProviderPopUp>
        <CartProvider>
            <CartPopUp userId={'1'}/>
        </CartProvider>
    
    </CartProviderPopUp>
    </MemoryRouter>
        )
await waitFor(() => {

    //check out button

    const checkOutButton  = screen.getByRole('button', {name: 'Check Out'})
    expect(checkOutButton).toBeInTheDocument()
    
    //test that cart heading is in document
    const cartHeading = screen.getByText('Cart');
    expect(cartHeading).toBeInTheDocument();

    //close button is in document
    const closeButton = screen.getByText('close');
    expect(closeButton).toBeInTheDocument();

    //total heading is in document
    const totalHeading = screen.getByText('Total');
    expect(totalHeading).toBeInTheDocument()

})

    })
    test('test your cart is empty text appears when cart is empty', async() => {
        render(
            <MemoryRouter>
            <CartProviderPopUp>
                <CartProvider>
                    <CartPopUp userId={'1'}/>
                </CartProvider>
            </CartProviderPopUp>
            </MemoryRouter>
        )
        await waitFor(() => {
            const cartEmptyText = screen.getByText('Your cart is empty');
            expect(cartEmptyText).toBeInTheDocument()
        })
        
    })
    test('first cart product is rendered correctly', async () => {
        render(
            <MemoryRouter>
            <CartProviderPopUp>
                <CartProvider>
                    <CartPopUp userId={'1'}/>
                </CartProvider>
            </CartProviderPopUp>
            </MemoryRouter>
        )
        await waitFor(() => {
            const productName = screen.getByText('Elegant Gold Bangle');
            expect(productName).toBeInTheDocument()
            const productImage = screen.getByAltText('Elegant Gold Bangle');
            expect(productImage).toBeInTheDocument();
            const productPrice = screen.getByText('$1100');
            expect(productPrice).toBeInTheDocument();
            const productQuantity = screen.getByText('1')
            expect(productQuantity).toBeInTheDocument()
          
            
        })
    })
    test('second cart product is rendered correctly', async () => {
        render(
            <MemoryRouter>
            <CartProviderPopUp>
                <CartProvider>
                    <CartPopUp userId={'1'}/>
                </CartProvider>
            </CartProviderPopUp>
            </MemoryRouter>
        )
        await waitFor(() => {
            const productName = screen.getByText('Boho Beaded Gold Necklace');
            expect(productName).toBeInTheDocument()
            const productImage = screen.getByAltText('Boho Beaded Gold Necklace');
            expect(productImage).toBeInTheDocument();
            const productPrice = screen.getByText('$349.99');
            expect(productPrice).toBeInTheDocument();
            const productQuantity = screen.getByText('3')
            expect(productQuantity).toBeInTheDocument()
          
            
        })
    })
    test('total cost is correct', async () => {
        render(
            <MemoryRouter>
            <CartProviderPopUp>
                <CartProvider>
                    <CartPopUp userId={'1'}/>
                </CartProvider>
            </CartProviderPopUp>
            </MemoryRouter>
        )
        await waitFor(() => {
            const totalAmount = screen.getByText('$2299.98')
            expect(totalAmount).toBeInTheDocument();
          
        })
        
    })
})
  
