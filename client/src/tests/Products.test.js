import {render, screen, waitFor} from '@testing-library/react';
import {setupServer} from 'msw/node';
import {rest} from 'msw';
import Products from '../features/Products/Products';
import { ProductsProvider } from '../features/Products/ProductsContext';
import { MemoryRouter } from 'react-router-dom';
import { SelectedProductProvider } from '../features/Products/SelectedProductContext';
const server = setupServer(
    // Define mock responses for your API endpoints
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
  if (req.url.searchParams.get('category') === 'null') {
    return res(
      ctx.status(200),
      ctx.json(null)
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
  
  return res(
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
  );
})
)
  //start msw server
  beforeAll(() => server.listen());

// Stop the MSW server after the tests
afterAll(() => server.close());

//tests
test("when category is all, products of all category should be rendered in the DOM", async()=> {
render(
<MemoryRouter>
<ProductsProvider>
<SelectedProductProvider>
    <Products filterCategory={"All"}/>
</SelectedProductProvider>
</ProductsProvider>
</MemoryRouter>
)


//check for bangle producrt
await waitFor(() => {
const bandgleProductName = screen.getByText('Elegant Gold Bangle');
const bangleImage = screen.getByAltText('Elegant Gold Bangle');

expect(bandgleProductName).toBeInTheDocument();
expect(bangleImage).toBeInTheDocument();

//check for earring product
const earringProductName = screen.getByText('Elegant Gold Earrings');
const earringImage = screen.getByAltText('Elegant Gold Earrings');

expect(earringProductName).toBeInTheDocument();
expect(earringImage).toBeInTheDocument();

//check for necklace product
const necklaceProductName = screen.getByText('Classic Gold Chain Necklace');
const necklaceImage = screen.getByText('Classic Gold Chain Necklace');

expect(necklaceProductName).toBeInTheDocument();
expect(necklaceImage).toBeInTheDocument();

//check for ring product
const ringProductName = screen.getByText('Classic Gold Band Ring');
const ringProductImage= screen.getByText('Classic Gold Band Ring');

expect(ringProductName).toBeInTheDocument();
expect(ringProductImage).toBeInTheDocument();


})
})
test("when category is bangles, only bangle products should be rendered", async()=> {
    render(
    <MemoryRouter>
    <ProductsProvider>
    <SelectedProductProvider>
        <Products filterCategory={"bangles"}/>
    </SelectedProductProvider>
    </ProductsProvider>
    </MemoryRouter>
    )
    
    
    //check for bangle producrt
    await waitFor(() => {
    const bandgleProductName = screen.getByText('Elegant Gold Bangle');
    const bangleImage = screen.getByAltText('Elegant Gold Bangle');
    
    expect(bandgleProductName).toBeInTheDocument();
    expect(bangleImage).toBeInTheDocument();
    
    //check fearrings not rendered
    const earringProductName = screen.queryByText('Elegant Gold Earrings');
    const earringImage = screen.queryByAltText('Elegant Gold Earrings');
    
    expect(earringProductName).not.toBeInTheDocument();
    expect(earringImage).not.toBeInTheDocument();
    
    //check for necklace product
    const necklaceProductName = screen.queryByText('Classic Gold Chain Necklace');
    const necklaceImage = screen.queryByText('Classic Gold Chain Necklace');
    
    expect(necklaceProductName).not.toBeInTheDocument();
    expect(necklaceImage).not.toBeInTheDocument();
    
    //check for ring product
    const ringProductName = screen.queryByText('Classic Gold Band Ring');
    const ringProductImage= screen.queryByText('Classic Gold Band Ring');
    
    expect(ringProductName).not.toBeInTheDocument();
    expect(ringProductImage).not.toBeInTheDocument();
    
    })
    })
    test("when category is earrings, only earring products should be rendered", async()=> {
        render(
        <MemoryRouter>
        <ProductsProvider>
        <SelectedProductProvider>
            <Products filterCategory={"earrings"}/>
        </SelectedProductProvider>
        </ProductsProvider>
        </MemoryRouter>
        )
        
        
        //check bangles are not rendered 
        await waitFor(() => {
        const bandgleProductName = screen.queryByText('Elegant Gold Bangle');
        const bangleImage = screen.queryByAltText('Elegant Gold Bangle');
        
        expect(bandgleProductName).not.toBeInTheDocument();
        expect(bangleImage).not.toBeInTheDocument();
        
        //check earrings is rendered
        const earringProductName = screen.getByText('Elegant Gold Earrings');
        const earringImage = screen.getByAltText('Elegant Gold Earrings');
        
        expect(earringProductName).toBeInTheDocument();
        expect(earringImage).toBeInTheDocument();
        
        //check for necklace product
        const necklaceProductName = screen.queryByText('Classic Gold Chain Necklace');
        const necklaceImage = screen.queryByText('Classic Gold Chain Necklace');
        
        expect(necklaceProductName).not.toBeInTheDocument();
        expect(necklaceImage).not.toBeInTheDocument();
        
        //check for ring product
        const ringProductName = screen.queryByText('Classic Gold Band Ring');
        const ringProductImage= screen.queryByText('Classic Gold Band Ring');
        
        expect(ringProductName).not.toBeInTheDocument();
        expect(ringProductImage).not.toBeInTheDocument();
        
        })
        })

        test("when category is necklaces, only necklace products should be rendered", async ()=> {
            render(
            <MemoryRouter>
            <ProductsProvider>
            <SelectedProductProvider>
                <Products filterCategory={"necklaces"}/>
            </SelectedProductProvider>
            </ProductsProvider>
            </MemoryRouter>
            )
            
            
            //check bangles are not rendered 
            await waitFor(() => {
            const bandgleProductName = screen.queryByText('Elegant Gold Bangle');
            const bangleImage = screen.queryByAltText('Elegant Gold Bangle');
            
            expect(bandgleProductName).not.toBeInTheDocument();
            expect(bangleImage).not.toBeInTheDocument();
            
            //check earrings is rendered
            const earringProductName = screen.queryByText('Elegant Gold Earrings');
            const earringImage = screen.queryByAltText('Elegant Gold Earrings');
            
            expect(earringProductName).not.toBeInTheDocument();
            expect(earringImage).not.toBeInTheDocument();
            
            //check for necklace product
            const necklaceProductName = screen.getByText('Classic Gold Chain Necklace');
            const necklaceImage = screen.getByText('Classic Gold Chain Necklace');
            
            expect(necklaceProductName).toBeInTheDocument();
            expect(necklaceImage).toBeInTheDocument();
            
            //check for ring product
            const ringProductName = screen.queryByText('Classic Gold Band Ring');
            const ringProductImage= screen.queryByText('Classic Gold Band Ring');
            
            expect(ringProductName).not.toBeInTheDocument();
            expect(ringProductImage).not.toBeInTheDocument();

            
            })
            
            await waitFor(() => {
                const bandgleProductName = screen.queryByText('Elegant Gold Bangle');
                const bangleImage = screen.queryByAltText('Elegant Gold Bangle');
                
                expect(bandgleProductName).not.toBeInTheDocument();
                expect(bangleImage).not.toBeInTheDocument();
                
                //check earrings is rendered
                const earringProductName = screen.queryByText('Elegant Gold Earrings');
                const earringImage = screen.queryByAltText('Elegant Gold Earrings');
                
                expect(earringProductName).not.toBeInTheDocument();
                expect(earringImage).not.toBeInTheDocument();
                
                //check for necklace product
                const necklaceProductName = screen.getByText('Classic Gold Chain Necklace');
                const necklaceImage = screen.getByText('Classic Gold Chain Necklace');
                
                expect(necklaceProductName).toBeInTheDocument();
                expect(necklaceImage).toBeInTheDocument();
                
                //check for ring product
                const ringProductName = screen.queryByText('Classic Gold Band Ring');
                const ringProductImage= screen.queryByText('Classic Gold Band Ring');
                
                expect(ringProductName).not.toBeInTheDocument();
                expect(ringProductImage).not.toBeInTheDocument();
    
                
                })
        })


        test("when category is rings, only rings products should be rendered", async ()=> {
            render(
            <MemoryRouter>
            <ProductsProvider>
            <SelectedProductProvider>
                <Products filterCategory={"rings"}/>
            </SelectedProductProvider>
            </ProductsProvider>
            </MemoryRouter>
            )
            
            
            //check bangles are not rendered 
            await waitFor(() => {
            const bandgleProductName = screen.queryByText('Elegant Gold Bangle');
            const bangleImage = screen.queryByAltText('Elegant Gold Bangle');
            
            expect(bandgleProductName).not.toBeInTheDocument();
            expect(bangleImage).not.toBeInTheDocument();
            
            //check earrings is rendered
            const earringProductName = screen.queryByText('Elegant Gold Earrings');
            const earringImage = screen.queryByAltText('Elegant Gold Earrings');
            
            expect(earringProductName).not.toBeInTheDocument();
            expect(earringImage).not.toBeInTheDocument();
            
            //check for necklace product
            const necklaceProductName = screen.queryByText('Classic Gold Chain Necklace');
            const necklaceImage = screen.queryByText('Classic Gold Chain Necklace');
            
            expect(necklaceProductName).not.toBeInTheDocument();
            expect(necklaceImage).not.toBeInTheDocument();
            
            //check for ring product
            const ringProductName = screen.queryByText('Classic Gold Band Ring');
            const ringProductImage= screen.queryByText('Classic Gold Band Ring');
            
            expect(ringProductName).not.toBeInTheDocument();
            expect(ringProductImage).not.toBeInTheDocument();

            
            })
            
            await waitFor(() => {
                const bandgleProductName = screen.queryByText('Elegant Gold Bangle');
                const bangleImage = screen.queryByAltText('Elegant Gold Bangle');
                
                expect(bandgleProductName).not.toBeInTheDocument();
                expect(bangleImage).not.toBeInTheDocument();
                
                //check earrings is rendered
                const earringProductName = screen.queryByText('Elegant Gold Earrings');
                const earringImage = screen.queryByAltText('Elegant Gold Earrings');
                
                expect(earringProductName).not.toBeInTheDocument();
                expect(earringImage).not.toBeInTheDocument();
                
                //check for necklace product
                const necklaceProductName = screen.queryByText('Classic Gold Chain Necklace');
                const necklaceImage = screen.queryByText('Classic Gold Chain Necklace');
                
                expect(necklaceProductName).not.toBeInTheDocument();
                expect(necklaceImage).not.toBeInTheDocument();
                
                //check for ring product
                const ringProductName = screen.getByText('Classic Gold Band Ring');
                const ringProductImage= screen.getByText('Classic Gold Band Ring');
                
                expect(ringProductName).toBeInTheDocument();
                expect(ringProductImage).toBeInTheDocument();
    
                
                })
        })

        test("loading test should be displayed initially", async () => {
            render(
                <MemoryRouter>
                <ProductsProvider>
                <SelectedProductProvider>
                    <Products filterCategory={"null"}/>
                </SelectedProductProvider>
                </ProductsProvider>
                </MemoryRouter>
                )
                await waitFor(() => {
                    const loadingText = screen.getByText("Loading...");
                    expect(loadingText).toBeInTheDocument()
                    
                })
              
            
        })