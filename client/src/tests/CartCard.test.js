import CartCard from "../components/CartCards/CartCard";
import { screen, render, waitFor} from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";
//set up server to intercept calls
const server = setupServer(
    // Define mock responses for your API endpoints
    rest.put('http://localhost:4000/carts', (req, res, ctx) => {
        const userId = req.url.searchParams.get('user_id');
        const productId = req.url.searchParams.get('product_id');
        const quantity = req.url.searchParams.get('quantity');
        if (userId === '1' && productId === '1' && quantity==='1') {
            return res(
              ctx.status(200),
              ctx.json([
                {
                  quantity: 1
                }
              ])
            );
          } 
          if (userId === '1' && productId === '1' && quantity==='2') {
            return res(
              ctx.status(200),
              ctx.json([
                {
                  quantity: 2
                }
              ])
            );
          } 
          else {
           
            return res(ctx.status(404));
          }
        }),
    

    rest.get('http://localhost:4000/carts/user-product-queries', (req, res, ctx) => {
        // Access query parameters using req.url.searchParams
        const userId = req.url.searchParams.get('user_id');
        const productId = req.url.searchParams.get('product_id');
      
        // Return the response based on the query parameters
        if (userId === '1' && productId === '1') {
          return res(
            ctx.status(200),
            ctx.json([
              {
                quantity: 1, 
              }
            ])
          );
        } else {
          // Return an error response for other cases
          return res(ctx.status(404));
        }
      }),
      rest.get('http://localhost:4000/carts/1', (req, res, ctx) => {

                return res (
                 ctx.status(200),
                   ctx.json([
                     {id: 1, product_id: 1, quantity: 1, user_id: 1}
                   ])
                 );
               } 
    
        )
      
)
//start msw server
beforeAll(() => server.listen());

// Stop the MSW server after the tests
afterAll(() => server.close());
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

