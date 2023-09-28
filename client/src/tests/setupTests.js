// Import Axios and any other necessary dependencies.
import axios from 'axios';

// Set the base URL for Axios requests.
axios.defaults.baseURL = 'http://localhost:4000';

// Import and configure MSW as you've already done.
import { server } from './mocks/server';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

// Import and configure Jest DOM if needed.
import '@testing-library/jest-dom';
