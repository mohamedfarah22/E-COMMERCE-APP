import { rest } from 'msw';

// Define your handlers as an array of objects
const handlers = [
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
    
        ),
        rest.get('http://localhost:4000/products', (req, res, ctx) => {
          if (req.url.searchParams.get('category') === 'bangles') {
            return res(
              ctx.status(200),
              ctx.json([
                {
                  id: 1,
                  product_name: 'Elegant Gold Bangle',
                  image_url: 'http://localhost:4001/elegant-gold-bangle'
                }
              ])
            );
          }
        
         if (req.url.searchParams.get('category') === 'earrings') {
            return res(
              ctx.status(200),
              ctx.json([
                {
                    id: 2,
                    product_name: 'Elegant Gold Earrings',
                    image_url: 'http://localhost:4001/elegant-gold-earrings'
                }
              ])
            );
          }
          if (req.url.searchParams.get('category') === 'necklaces') {
            return res(
              ctx.status(200),
              ctx.json([
                {
                    id: 3,
                    product_name: 'Classic Gold Chain Necklace',
                    image_url: 'http://localhost:4001/classic-gold-chain-necklace'
                  }
              ])
            );
          }
        
          if (req.url.searchParams.get('category') === 'rings') {
            return res(
              ctx.status(200),
              ctx.json([
                {
                    id: 4,
                    product_name: 'Classic Gold Band Ring',
                    image_url: 'http://localhost:4001/classic-gold-band-ring'
                  }
              ])
            );
          }
         else{
          return  res(
            ctx.status(200),
            ctx.json([
                {
                    id: 1,
                    product_name: 'Elegant Gold Bangle',
                    image_url: 'http://localhost:4001/elegant-gold-bangle'
                  },
              {
                id: 2,
                product_name: 'Elegant Gold Earrings',
                image_url: 'http://localhost:4001/elegant-gold-earrings'
              },
              {
                id: 3,
                product_name: 'Classic Gold Chain Necklace',
                image_url: 'http://localhost:4001/classic-gold-chain-necklace'
              },
              {
                id: 4,
                product_name: 'Classic Gold Band Ring',
                image_url: 'http://localhost:4001/classic-gold-band-ring'
              }
            ])
          )}
          
      }
        ),
  
        rest.get('http://localhost:4000/products/1', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json([
              {
                id: 1,
                product_name: 'Elegant Gold Bangle',
                image_url: 'http://localhost:4001/elegant-gold-bangle',
                product_description: 'Elevate your style with this exquisite gold bangle, weighing a delicate 10 grams. Its intricate design and comfortable fit make it a perfect accessory for any occasion.',
                price: 1100
              }
            ])
          );
        }),
      
        rest.get('http://localhost:4000/products/categories', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json(
              [{category: 'rings'}, {category: 'bangles'}, {category: 'necklaces'}, {category: 'earrings'}]
            )
          );
        }),
      
      
      
        rest.get('http://localhost:4000/carts/cart-total', (req, res, ctx) => {
          // Access query parameters using req.url.searchParams
          const userId = req.url.searchParams.get('user_id');
          
          // Return the response based on the userId
          if (userId === '1') {
            return res(
              ctx.status(200),
              ctx.json([
                {
                  total_cost: 1100
                }
              ])
            );
          } 
        }),
        rest.get('http://localhost:4000/carts/cart-total', (req, res, ctx) => {
          // Access query parameters using req.url.searchParams
          const userId = req.url.searchParams.get('user_id');
          
          // Return the response based on the userId
          if (userId === '1') {
            return res(
              ctx.status(200),
              ctx.json([
                {
                  total_cost: 1100
                }
              ])
            );
          } 
        })
      ];   

export { handlers };
