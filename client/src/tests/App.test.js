import App from "../App";
import React from 'react';
import { render, screen, waitFor} from '@testing-library/react';
import { CartProvider } from "../features/Cart/CartContext";
import { CartProviderPopUp } from "../features/Cart/CartPopUpContext";
import { ProductsProvider } from "../features/Products/ProductsContext";
import { SelectedProductProvider } from "../features/Products/SelectedProductContext";
import '@testing-library/jest-dom';
import { server } from "./mocks/server";
import userEvent from "@testing-library/user-event";
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
test('chatbot rendered as closed', async() => {
    render(
     
            <CartProvider>
                <CartProviderPopUp>
                    <ProductsProvider>
                        <SelectedProductProvider>
                            <App/>
                        </SelectedProductProvider>
                    </ProductsProvider>
                </CartProviderPopUp>
            </CartProvider>
       
    )
    //expect initial chatbot message not to be in DOM
    const chatBotMessage = screen.queryByText("Hello, I am your shopping assistant for luxuria, need a hand?");
    expect(chatBotMessage).not.toBeInTheDocument()

    //set up user event
    const user = userEvent.setup();
    //find minimise button
    const minimiseButton = screen.getByText('minimize')
    user.click(minimiseButton)

    await waitFor(() => {
        const chatBotMessage = screen.getByText("Hello, I am your shopping assistant for luxuria, need a hand?");
        expect(chatBotMessage).toBeInTheDocument()
        
    })

})