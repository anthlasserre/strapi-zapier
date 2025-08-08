import { expect, test } from 'vitest';
import authentication from '../authentication.js';

test('authentication should have correct structure', () => {
  expect(authentication.type).toBe('custom');
  expect(authentication.fields).toHaveLength(2);
  expect(authentication.fields[0].key).toBe('baseUrl');
  expect(authentication.fields[1].key).toBe('apiToken');
});

test('authentication test should work with valid credentials', async () => {
  const mockZ = {
    request: async (request: any) => ({
      data: { data: [] }, // Mock content-type-builder response
      status: 200,
    }),
  } as any;

  const mockBundle = {
    authData: {
      baseUrl: 'https://test-strapi.com',
      apiToken: 'test-token',
    },
  } as any;

  const result = await authentication.test(mockZ, mockBundle);
  expect(result).toEqual({ data: [] });
});
