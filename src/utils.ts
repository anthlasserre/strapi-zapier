import type { ZObject, Bundle } from 'zapier-platform-core';
import { STRAPI_API_BASE } from './constants.js';

// Types for Strapi API responses
export interface StrapiContentType {
  uid: string;
  plugin?: string;
  apiID: string;
  schema: {
    kind: 'singleType' | 'collectionType';
    displayName: string;
    collectionName: string;
    singularName: string;
    pluralName: string;
    description?: string;
    visible: boolean;
    attributes: Record<string, StrapiAttribute>;
  };
}

export interface StrapiAttribute {
  type: string;
  required?: boolean;
  unique?: boolean;
  default?: any;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  enum?: string[];
  target?: string;
  targetAttribute?: string;
  private?: boolean;
  configurable?: boolean;
  writable?: boolean;
  visible?: boolean;
  relation?: string;
  inversedBy?: string;
  mappedBy?: string;
}

export interface StrapiEntry {
  id: number;
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Get all content types from Strapi
export const getContentTypes = async (z: ZObject, bundle: Bundle): Promise<StrapiContentType[]> => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}/api/content-type-builder/content-types`,
    headers: {
      'Authorization': `Bearer ${bundle.authData.apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data.data;
};

// Get entries for a specific content type
export const getEntries = async (
  z: ZObject,
  bundle: Bundle,
  contentType: string,
  params: Record<string, any> = {}
): Promise<StrapiResponse<StrapiEntry[]>> => {
  const queryParams = new URLSearchParams({
    ... {
      'pagination[pageSize]': '100',
      'sort': 'createdAt:desc',
    },
    ...params,
  });

  const response = await z.request({
    url: `${bundle.authData.baseUrl}${STRAPI_API_BASE}/${contentType}?${queryParams}`,
    headers: {
      'Authorization': `Bearer ${bundle.authData.apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

// Get a single entry by ID
export const getEntry = async (
  z: ZObject,
  bundle: Bundle,
  contentType: string,
  id: number
): Promise<StrapiResponse<StrapiEntry>> => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}${STRAPI_API_BASE}/${contentType}/${id}`,
    headers: {
      'Authorization': `Bearer ${bundle.authData.apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

// Create a new entry
export const createEntry = async (
  z: ZObject,
  bundle: Bundle,
  contentType: string,
  data: Record<string, any>
): Promise<StrapiResponse<StrapiEntry>> => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}${STRAPI_API_BASE}/${contentType}`,
    headers: {
      'Authorization': `Bearer ${bundle.authData.apiToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: { data },
  });

  return response.data;
};

// Update an entry
export const updateEntry = async (
  z: ZObject,
  bundle: Bundle,
  contentType: string,
  id: number,
  data: Record<string, any>
): Promise<StrapiResponse<StrapiEntry>> => {
  const response = await z.request({
    url: `${bundle.authData.baseUrl}${STRAPI_API_BASE}/${contentType}/${id}`,
    headers: {
      'Authorization': `Bearer ${bundle.authData.apiToken}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: { data },
  });

  return response.data;
};

// Delete an entry
export const deleteEntry = async (
  z: ZObject,
  bundle: Bundle,
  contentType: string,
  id: number
): Promise<void> => {
  await z.request({
    url: `${bundle.authData.baseUrl}${STRAPI_API_BASE}/${contentType}/${id}`,
    headers: {
      'Authorization': `Bearer ${bundle.authData.apiToken}`,
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  });
};

// Get content types for dropdown selection
export const getContentTypesForDropdown = async (z: ZObject, bundle: Bundle) => {
  const contentTypes = await getContentTypes(z, bundle);

  return contentTypes
    .filter(ct =>
      ct.schema.kind === 'collectionType' && // Only collection types for CRUD operations
      ct.schema.visible && // Only visible content types
      !ct.plugin && // Exclude plugin content types (admin, users-permissions, etc.)
      ct.uid.startsWith('api::') // Only user-defined API content types
    )
    .map(ct => ({
      id: ct.schema.pluralName,
      name: ct.schema.displayName,
    }));
};

// Convert Strapi entry to Zapier format
export const convertStrapiEntryToZapier = (entry: StrapiEntry) => {
  const result: Record<string, any> = {
    id: entry.id,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    publishedAt: entry.publishedAt,
  };

  // Flatten attributes
  Object.entries(entry.attributes).forEach(([key, value]) => {
    result[key] = value;
  });

  return result;
}; 