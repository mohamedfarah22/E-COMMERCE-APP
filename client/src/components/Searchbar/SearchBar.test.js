import React from 'react';
import { render, screen} from '@testing-library/react';
import Searchbar from './Searchbar';
import { ProductsProvider } from '../../features/Products/ProductsContext';
describe('tests if search bar component renders correctly', () =>{
    test('if text input renders correctly', ()=>{
        render(
    <ProductsProvider>
        <Searchbar />
    </ProductsProvider>
        )
        const textInput = screen.getByPlaceholderText('Search...');

        expect(textInput).toBeInTheDocument();

    })

    test('if search button is rendered', () => {
        render(
            <ProductsProvider>
                <Searchbar />
            </ProductsProvider>
                )
        const searchButton = screen.getByRole('button');

        expect(searchButton).toBeInTheDocument();
    })
})