import { setupServer } from 'msw/node'// Import your MSW server setup
import { handlers } from './handlers'; // Import the array of handlers


// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);


