import { expect, test } from 'vitest';
import { getContentTypesForDropdown } from '../utils.js';

test('getContentTypesForDropdown should filter and format content types correctly', async () => {
  const mockZ = {
    request: async (request: any) => ({
      data: {
        data: [
          // Admin content type (should be filtered out)
          {
            uid: 'admin::permission',
            plugin: 'admin',
            apiID: 'permission',
            schema: {
              kind: 'collectionType',
              displayName: 'Permission',
              pluralName: 'permissions',
              visible: false,
            },
          },
          // Plugin content type (should be filtered out)
          {
            uid: 'plugin::users-permissions.user',
            plugin: 'users-permissions',
            apiID: 'user',
            schema: {
              kind: 'collectionType',
              displayName: 'User',
              pluralName: 'users',
              visible: true,
            },
          },
          // Valid API content type (should be included)
          {
            uid: 'api::article.article',
            apiID: 'article',
            schema: {
              kind: 'collectionType',
              displayName: 'Article',
              pluralName: 'articles',
              visible: true,
            },
          },
          // Single type (should be filtered out)
          {
            uid: 'api::homepage.homepage',
            apiID: 'homepage',
            schema: {
              kind: 'singleType',
              displayName: 'Homepage',
              pluralName: 'homepages',
              visible: true,
            },
          },
          // Valid API content type (should be included)
          {
            uid: 'api::blog-post.blog-post',
            apiID: 'blog-post',
            schema: {
              kind: 'collectionType',
              displayName: 'Blog Post',
              pluralName: 'blog-posts',
              visible: true,
            },
          },
        ],
      },
    }),
  } as any;

  const mockBundle = {
    authData: {
      baseUrl: 'https://test-strapi.com',
      apiToken: 'test-token',
    },
  } as any;

  const result = await getContentTypesForDropdown(mockZ, mockBundle);

  expect(result).toEqual([
    { key: 'article', label: 'Article' },
    { key: 'blog-post', label: 'Blog Post' },
  ]);

  // Should only include API content types that are collection types and visible
  expect(result).toHaveLength(2);
});

test('getContentTypesForDropdown should handle empty response', async () => {
  const mockZ = {
    request: async (request: any) => ({
      data: { data: [] },
    }),
  } as any;

  const mockBundle = {
    authData: {
      baseUrl: 'https://test-strapi.com',
      apiToken: 'test-token',
    },
  } as any;

  const result = await getContentTypesForDropdown(mockZ, mockBundle);

  expect(result).toEqual([]);
});