import type { ZObject, Bundle, Authentication } from 'zapier-platform-core';

const httpRegex = /^https?:\/\//;

// Test the authentication by making a request to the Strapi admin API
const test = async (z: ZObject, bundle: Bundle) => {
  if (!bundle.authData.baseUrl) {
    throw new Error("Base URL is required");
  }

  if (!httpRegex.test(bundle.authData.baseUrl)) {
    throw new Error(
      "Base URL must start with http:// or https://"
    );
  }

  const response = await z.request({
    url: `${bundle.authData.baseUrl}/api/content-type-builder/content-types`,
    headers: {
      'Authorization': `Bearer ${bundle.authData.apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export default {
  type: 'custom',

  // Define the input fields for authentication
  fields: [
    {
      key: 'baseUrl',
      type: 'string',
      required: true,
      helpText: 'Your Strapi instance URL (e.g., https://your-strapi-app.com)',
      placeholder: 'https://your-strapi-app.com',
    },
    {
      key: 'apiToken',
      type: 'password',
      required: true,
      helpText: 'Your Strapi API token. You can create one in Settings > API Tokens in your Strapi admin panel. You can also find additional information in the [Strapi documentation](https://docs.strapi.io/cms/features/api-tokens#creating-a-new-api-token).',
      placeholder: 'your-api-token-here',
    },
  ],

  // Test the authentication
  test,

  // Connection label shows the Strapi instance URL
  connectionLabel: '{{baseUrl}}',
} satisfies Authentication;
