import {
  defineInputFields,
  defineCreate,
  type InferInputData,
  type CreatePerform,
} from 'zapier-platform-core';
import { getContentTypes, createEntry, convertStrapiEntryToZapier, type StrapiAttribute } from '../utils.js';

// Helper function to map Strapi field types to Zapier field types
const mapStrapiTypeToZapierType = (strapiType: string): string => {
  const typeMap: Record<string, string> = {
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
  };

  return typeMap[strapiType] || 'string';
};

// Helper function to create input field from Strapi attribute
const createInputFieldFromAttribute = (key: string, attribute: StrapiAttribute) => {
  const field: any = {
    key,
    type: mapStrapiTypeToZapierType(attribute.type),
    required: attribute.required || false,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
    helpText: `Field: ${key} (${attribute.type})`,
  };

  // Add default value if specified
  if (attribute.default !== undefined) {
    field.default = attribute.default.toString();
  }

  // Add choices for enumeration types
  if (attribute.type === 'enumeration' && attribute.enum) {
    field.choices = attribute.enum.map(choice => ({
      value: choice,
      label: choice,
    }));
  }

  // Add validation for string types
  if (attribute.type === 'string' || attribute.type === 'text') {
    if (attribute.minLength) {
      field.helpText += ` (min: ${attribute.minLength})`;
    }
    if (attribute.maxLength) {
      field.helpText += ` (max: ${attribute.maxLength})`;
    }
  }

  // Add validation for number types
  if (attribute.type === 'integer' || attribute.type === 'decimal' || attribute.type === 'float') {
    if (attribute.min !== undefined) {
      field.helpText += ` (min: ${attribute.min})`;
    }
    if (attribute.max !== undefined) {
      field.helpText += ` (max: ${attribute.max})`;
    }
  }

  return field;
};

// Dynamic input fields that will be populated based on content type selection
const inputFields = defineInputFields([
  {
    key: 'contentType',
    type: 'string',
    required: true,
    label: 'Content Type',
    helpText: 'Select the content type to create an entry in',
    dynamic: 'content_types.id.name',
  },
  {
    key: 'published',
    type: 'boolean',
    required: false,
    label: 'Published',
    helpText: 'Whether the entry should be published immediately',
    default: 'true',
  },
]);

const perform = (async (z, bundle) => {
  const { contentType, published = true, ...fieldData } = bundle.inputData;

  // Get the content type schema to validate fields
  const contentTypes = await getContentTypes(z, bundle);
  const selectedContentType = contentTypes.find(ct => ct.apiID === contentType);

  if (!selectedContentType) {
    throw new Error(`Content type '${contentType}' not found`);
  }

  // Prepare the data for Strapi
  const data: Record<string, any> = {
    publishedAt: published ? new Date().toISOString() : null,
  };

  // Process each field based on the content type schema
  Object.entries(fieldData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const attribute = selectedContentType.schema.attributes[key];

      if (attribute) {
        // Convert value based on field type
        let processedValue = value;

        switch (attribute.type) {
          case 'boolean':
            processedValue = Boolean(value);
            break;
          case 'integer':
          case 'biginteger':
            processedValue = parseInt(value as string, 10);
            break;
          case 'decimal':
          case 'float':
            processedValue = parseFloat(value as string);
            break;
          case 'date':
          case 'datetime':
            // Ensure proper date format
            if (typeof value === 'string') {
              processedValue = new Date(value).toISOString();
            }
            break;
          case 'json':
            // Try to parse JSON if it's a string
            if (typeof value === 'string') {
              try {
                processedValue = JSON.parse(value);
              } catch {
                // Keep as string if parsing fails
              }
            }
            break;
        }

        data[key] = processedValue;
      }
    }
  });

  // Create the entry
  const response = await createEntry(z, bundle, contentType, data);

  // Convert to Zapier format
  return convertStrapiEntryToZapier(response.data);
}) satisfies CreatePerform<InferInputData<typeof inputFields>>;

export default defineCreate({
  key: 'create_entry_advanced',
  noun: 'Entry',

  display: {
    label: 'Create Entry (Advanced)',
    description: 'Creates a new entry in a Strapi content type with dynamic field generation.',
  },

  operation: {
    inputFields,
    perform,
    sample: {
      id: 1,
      title: 'New Entry',
      description: 'This is a new entry',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      publishedAt: '2024-01-01T00:00:00.000Z',
    },
  },
});
