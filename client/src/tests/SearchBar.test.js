import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import Searchbar from '../components/Searchbar/Searchbar';
import { ProductsProvider } from '../features/Products/ProductsContext';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { server } from './mocks/server';
describe('tests if search bar component renders correctly', () =>{
    beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
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