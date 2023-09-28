import CartCard from "../components/CartCards/CartCard";
import { screen, render, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from "@testing-library/user-event";

test('cart item renders with correct passed down prop and initial quantity of 1', async() => {
    render(<CartCard cartProduct = {[{
        id: 1,
        product_name: 'Elegant Gold Bangle',
        image_url: 'http://localhost:4001/elegant-gold-bangle',
        product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.',
        price: 1100
      }]}
      cart={[{id: 1, product_id: 1, quantity: 1, user_id: 1}]}
      setCart={jest.fn()}
      userId='1'/>)
      await waitFor(() => {
        //find product name
        const productName = screen.getByText('Elegant Gold Bangle');
        expect(productName).toBeInTheDocument();
        //find product image
        const productImage = screen.getByAltText('Elegant Gold Bangle')
        expect(productImage).toBeInTheDocument();
        //find product price;
        const productPrice = screen.getByText('$1100');
        expect(productPrice).toBeInTheDocument();

        //find quantity button increment
        const incrementButton = screen.getByRole('button', {name: '+'});
        expect(incrementButton).toBeInTheDocument();

        //find decrement button
        const decrementButton = screen.getByRole('button', {name: '-'});
        expect(decrementButton).toBeInTheDocument();

        //find initial quantity
        const quantityText= screen.getByText('1');
        expect(quantityText).toBeInTheDocument();
       

      })

})

test('increment button increses quantity', async() => {
    render(<CartCard cartProduct = {[{
        id: 1,
        product_name: 'Elegant Gold Bangle',
        image_url: 'http://localhost:4001/elegant-gold-bangle',
        product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.',
        price: 1100
      }]}
      cart={[{id: 1, product_id: 1, quantity: 1, user_id: 1}]}
      setCart={jest.fn()}
      userId='1'/>)
      //setup user event
      const user = userEvent.setup()
      await waitFor(() => {
        //find increment button and initial quantity
        const incrementButton = screen.getByRole('button', {name: '+'});

        user.click(incrementButton);
        const newQuantity = screen.getByText('2');
        expect(newQuantity).toBeInTheDocument();

      })
      
})
test('decrement button decreases quantity', async() => {
    render(<CartCard cartProduct = {[{
        id: 1,
        product_name: 'Elegant Gold Bangle',
        image_url: 'http://localhost:4001/elegant-gold-bangle',
        product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.',
        price: 1100
      }]}
      cart={[{id: 1, product_id: 1, quantity: 1, user_id: 1}]}
      setCart={jest.fn()}
      userId='1'/>)
      //setup user event
      const user = userEvent.setup()
      await waitFor(() => {
        //find increment button and initial quantity
        const incrementButton = screen.getByRole('button', {name: '+'});
        const decrementButton = screen.getByRole('button', {name: '-'});
        user.click(incrementButton);
        user.click(incrementButton);
        user.click(decrementButton)
        const newQuantity = screen.getByText('1');
        expect(newQuantity).toBeInTheDocument();
        

      })
      
})

