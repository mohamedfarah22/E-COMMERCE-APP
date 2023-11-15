import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import MainLayout from "../features/MainLayout/MainLayout";
import { MemoryRouter } from 'react-router-dom';
import { CartProviderPopUp, PopupContext } from '../features/Cart/CartPopUpContext';
import { CartProvider } from '../features/Cart/CartContext';
import { ProductsProvider } from '../features/Products/ProductsContext';
import { server } from './mocks/server';
import userEvent from '@testing-library/user-event';
import { SelectedProductProvider } from '../features/Products/SelectedProductContext';
import '@testing-library/jest-dom';
//test cart appears when cart item is clicked on
//test cart disappears when cart item is clicked off
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
test('cart appears when cart logo is clicked on and disappears when close is clicked', async () => {
    const setLoggedIn = jest.fn();
    const setUserId = jest.fn();
    const customPopUp = {
      openPopUp: false,
      setOpenPopUp: jest.fn(),
    };
  
    render(
      <MemoryRouter>
        <PopupContext.Provider value={customPopUp}>
          <CartProviderPopUp>
            <CartProvider>
              <ProductsProvider>
                <SelectedProductProvider>
                  <MainLayout
                    setLoggedIn={setLoggedIn}
                    setUserId={setUserId}
                    filterCategory={'All'}
                    setFilterCategory={jest.fn()}
                    userId={'1'}
                  />
                </SelectedProductProvider>
              </ProductsProvider>
            </CartProvider>
          </CartProviderPopUp>
        </PopupContext.Provider>
      </MemoryRouter>
    );
  
    // Set up user event
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

    
  });
  