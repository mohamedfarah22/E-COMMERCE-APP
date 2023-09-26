import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import Searchbar from '../components/Searchbar/Searchbar';
import { ProductsProvider } from '../features/Products/ProductsContext';
import userEvent from '@testing-library/user-event';
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
    test('search bar displaying what is type in it', async() => {
        render(
            <ProductsProvider>
                <Searchbar />
            </ProductsProvider>
                )
        const textInput = screen.getByPlaceholderText('Search...');
        //set up user event
        const user = userEvent.setup()
        //type
    waitFor(() => {
        user.type(textInput, "bangle jewlery2!");
        //assert
        expect(textInput).toHaveValue("bangle jewlery2!")
    })
     
    })
})