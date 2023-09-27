import { setupServer } from "msw/node";; // Import your MSW server setup
import { handlers } from './handlers'; // Import the array of handlers


// This configures a request mocking server with the given request handlers.
const server = setupServer(...handlers);

beforeAll(() => {
    // Add all the handlers to the MSW server
    handlers.forEach(({ request }) => {
      server.use(request);
    });
    server.listen();
  });
  
  afterAll(() => server.close());