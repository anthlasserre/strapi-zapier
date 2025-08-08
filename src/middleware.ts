import type { ZObject, Bundle, BeforeRequestMiddleware, AfterResponseMiddleware } from 'zapier-platform-core';

// Add authentication headers to all requests
const addAuthHeaders: BeforeRequestMiddleware = (request, z, bundle) => {
  if (bundle.authData.apiToken) {
    request.headers = {
      ...request.headers,
      'Authorization': `Bearer ${bundle.authData.apiToken}`,
      'Content-Type': 'application/json',
    };
  }
  return request;
};

// Handle Strapi API responses and errors
const handleStrapiResponses: AfterResponseMiddleware = (response, z, bundle) => {
  const responseMessage = `URL: ${response?.request?.url}\nParams: ${JSON.stringify(response?.request?.params)}\nError: ${response?.data?.error?.message}`;
  if (response.status === 401) {
    throw new z.errors.Error(
      responseMessage || 'Your API token is invalid or has expired. Please check your Strapi API token.',
      'AuthenticationError',
      response.status,
    );
  }

  if (response.status === 403) {
    throw new z.errors.Error(
      responseMessage || 'You do not have permission to access this resource. Please check your API token permissions.',
      'AuthenticationError',
      response.status,
    );
  }

  if (response.status === 404) {
    throw new z.errors.Error(
      responseMessage || 'The requested resource was not found. Please check your Strapi instance URL and content-type configuration..',
      'InvalidResponseError',
      response.status,
    );
  }

  if (response.status >= 500) {
    throw new z.errors.Error(
      responseMessage || 'Strapi server error. Please try again later.',
      'InvalidResponseError',
      response.status,
    );
  }

  return response;
};

export const befores = [addAuthHeaders];
export const afters = [handleStrapiResponses];
