// Common constants for the Strapi integration
export const STRAPI_API_BASE = '/api';
export const STRAPI_ADMIN_API_BASE = '/admin';

// Common field types that can be mapped from Strapi to Zapier
export const FIELD_TYPE_MAPPING = {
  'string': 'string',
  'text': 'string',
  'richtext': 'string',
  'email': 'string',
  'password': 'string',
  'date': 'datetime',
  'datetime': 'datetime',
  'time': 'string',
  'timestamp': 'datetime',
  'integer': 'integer',
  'biginteger': 'integer',
  'decimal': 'number',
  'float': 'number',
  'boolean': 'boolean',
  'enumeration': 'string',
  'json': 'string',
  'media': 'string',
  'component': 'string',
  'dynamiczone': 'string',
  'relation': 'string',
} as const;

// Default sample data for different field types
export const SAMPLE_DATA = {
  string: 'Sample text',
  text: 'Sample long text content',
  email: 'user@example.com',
  integer: 123,
  number: 123.45,
  boolean: true,
  datetime: '2024-01-01T00:00:00.000Z',
  media: 'https://example.com/image.jpg',
} as const; 