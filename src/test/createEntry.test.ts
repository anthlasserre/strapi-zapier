import { expect, test } from 'vitest';
import { createEntry } from '../utils.js';

test('createEntry should create a new entry successfully', async () => {
  const mockZ = {
    request: async (request: any) => ({
      data: {
        data: {
          id: 1,
          attributes: {
            title: 'Test Entry',
            description: 'Test Description',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
            publishedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      },
    }),
  } as any;

  const mockBundle = {
    authData: {
      baseUrl: 'https://test-strapi.com',
      apiToken: 'test-token',
    },
  } as any;

  const contentType = 'article';
  const data = {
    title: 'Test Entry',
    description: 'Test Description',
  };

  const result = await createEntry(mockZ, mockBundle, contentType, data);

  expect(result.data).toEqual({
    id: 1,
    attributes: {
      title: 'Test Entry',
      description: 'Test Description',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      publishedAt: '2024-01-01T00:00:00.000Z',
    },
  });
});

test('createEntry should handle different data types correctly', async () => {
  const mockZ = {
    request: async (request: any) => {
      // Verify the request was made correctly
      expect(request.url).toBe('https://test-strapi.com/api/article');
      expect(request.method).toBe('POST');
      expect(request.body).toEqual({
        data: {
          title: 'Test Entry',
          number: 42,
          boolean: true,
          date: '2024-01-01T00:00:00.000Z',
        },
      });

      return {
        data: {
          data: {
            id: 1,
            attributes: request.body.data,
          },
        },
      };
    },
  } as any;

  const mockBundle = {
    authData: {
      baseUrl: 'https://test-strapi.com',
      apiToken: 'test-token',
    },
  } as any;

  const contentType = 'article';
  const data = {
    title: 'Test Entry',
    number: 42,
    boolean: true,
    date: '2024-01-01T00:00:00.000Z',
  };

  const result = await createEntry(mockZ, mockBundle, contentType, data);

  expect(result.data.attributes).toEqual(data);
});
