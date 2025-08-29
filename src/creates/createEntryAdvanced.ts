import {
  defineInputFields,
  defineCreate,
  type InferInputData,
  type CreatePerform,
} from 'zapier-platform-core';
import { getContentTypes, createEntry, convertStrapiEntryToZapier, type StrapiAttribute } from '../utils.js';


// Dynamic input fields that will be populated based on content type selection
const inputFields = defineInputFields([
  {
    key: 'contentType',
    type: 'string',
    required: true,
    label: 'Content Type',
    helpText: 'Select the content type to create an entry in',
    dynamic: 'content_types.id.label',
  },
  {
    key: 'fields',
    type: 'text',
    required: true,
    label: 'Entry Fields (JSON)',
    helpText: 'JSON object containing all the fields for this entry. Use the "Content Type Schema" resource to see available fields.',
  },
]);

const perform = (async (z, bundle) => {
  const { contentType, fields } = bundle.inputData;

  // Parse the fields JSON
  const data = JSON.parse(fields);

  // Create the entry
  const response = await createEntry(z, bundle, contentType, data);

  // Convert to Zapier format
  return convertStrapiEntryToZapier(response.data);
}) satisfies CreatePerform<InferInputData<typeof inputFields>>;

export default defineCreate({
  key: 'create_entry',
  noun: 'Entry',

  display: {
    label: 'Create Entry',
    description: 'Creates a new entry in a Strapi content type with comprehensive field support.',
  },

  operation: {
    inputFields,
    perform,
    sample: {
      id: 1,
      title: 'New Entry',
      description: 'This is a new entry',
      content: 'This is the content of the entry',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      publishedAt: '2024-01-01T00:00:00.000Z',
    },
  },
});
