import React from 'react';
import { render, screen} from '@testing-library/react';
import Product from '../components/Product/Product';
import { MemoryRouter } from 'react-router-dom';
import { SelectedProductProvider } from '../features/Products/SelectedProductContext';
import '@testing-library/jest-dom';
import { server } from './mocks/server';
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
describe('check if passed down prroduct prop is rendered in product component', () => {
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