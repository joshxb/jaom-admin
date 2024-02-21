// This code sets up the environment configuration for the application.
// It is currently set to the staging environment.

// Define the environment object with two properties:
// - production: a boolean indicating whether the application is in production mode
// - baseUrl: the base URL for making API requests
export const environment = {
  production: false, // Set to false for staging environment
  baseUrl: 'https://jaom-server.vercel.app' // Base URL for API requests in the staging environment
};
