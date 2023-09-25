import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import Header from './Header.js';
import { MemoryRouter } from 'react-router-dom';
import { CartProviderPopUp } from '../Cart/CartPopUpContext.js';
import { CartProvider } from '../Cart/CartContext.js';
import { ProductsProvider } from '../Products/ProductsContext.js';
import userEvent from '@testing-library/user-event'

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
  
  test('if searchbar rendered ', () => {
    const user = userEvent.setup();
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

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  
    });
    test('cart quantity is displayed correctly', () => {
    
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
  
      expect(screen.getByText("0")).toBeInTheDocument();
    
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
      