import { setupServer } from "msw/node";; // Import your MSW server setup
import { handlers } from './handlers'; // Import the array of handlers


// This configures a request mocking server with the given request handlers.
const server = setupServer(...handlers);

// Import the mock server
import { server } from './mockServiceWorker';

// Start the mock server
beforeAll(() => server.listen());

// Stop the mock server after tests or when no longer needed
afterAll(() => server.close());

// Your tests or application code that makes HTTP requests
