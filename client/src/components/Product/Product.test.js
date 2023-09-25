import React from 'react';
import { render, screen} from '@testing-library/react';
import Product from './Product';
import { MemoryRouter } from 'react-router-dom';
import { SelectedProductProvider } from '../../features/Products/SelectedProductContext';
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