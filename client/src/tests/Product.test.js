import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import Product from '../components/Product/Product';
import { MemoryRouter } from 'react-router-dom';
import { SelectedProductProvider } from '../features/Products/SelectedProductContext';
import '@testing-library/jest-dom';
import { server } from './mocks/server';
import userEvent from '@testing-library/user-event';
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
describe('check if passed down product prop is rendered in product component', () => {
    test("product name is rendered", () => {
        const product = {product_name: 'Elegant Gold Bangle', image_url:'http://localhost:4000/elegant-gold-bangle'}
   render(
<SelectedProductProvider>
    <MemoryRouter>
        <Product product={product}/>
    </MemoryRouter>
</SelectedProductProvider>
        )

        const productName = screen.getByText('Elegant Gold Bangle');

        expect(productName).toBeInTheDocument()

    })
    test("product image is rendered", () => {
        const product = {product_name: 'Elegant Gold Bangle', image_url:'http://localhost:4000/elegant-gold-bangle'}
   render(
<SelectedProductProvider>
    <MemoryRouter>
        <Product product={product}/>
    </MemoryRouter>
</SelectedProductProvider>
        )

        const productImage = screen.getByAltText(product.product_name);

        expect(productImage).toBeInTheDocument()

    })
})
//test product component navigates to productpage
test("clicking on product navigates to product page", async() => {
    const product = {id: 1, product_name: 'Elegant Gold Bangle', image_url:'http://localhost:4000/elegant-gold-bangle'}
    const navigateMock = jest.fn();
    
require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
render(
<SelectedProductProvider>
<MemoryRouter>
    <Product product={product}/>
</MemoryRouter>
</SelectedProductProvider>
    )
//set up user event
const user = userEvent.setup();
//click on product and navigate to route to '/product.id/product name

await waitFor(() => {
    //get product name
    const productContainer = screen.getByText('Elegant Gold Bangle').parentElement;
    //click container
    user.click(productContainer);

    expect(navigateMock).toHaveBeenCalledWith('/1/Elegant-Gold-Bangle')
})


})
