import {
  defineInputFields,
  defineSearch,
  type InferInputData,
  type SearchPerform,
} from 'zapier-platform-core';
import { getEntries, convertStrapiEntryToZapier } from '../utils.js';

const inputFields = defineInputFields([
  {
    key: 'contentType',
    type: 'string',
    required: true,
    label: 'Content Type',
    helpText: 'Select the content type to search in',
    dynamic: 'content_types.id.label',
  },
  {
    key: 'query',
    type: 'string',
    required: false,
    label: 'Search Query',
    helpText: 'Search for entries containing this text in the title or description',
  },
  {
    key: 'limit',
    type: 'integer',
    required: false,
    label: 'Limit',
    helpText: 'Maximum number of entries to return (default: 10)',
    default: '10',
  },
  {
    key: 'params',
    type: 'text',
    required: false,
    label: 'Additional Parameters',
    helpText: 'Additional parameters to pass to the API (e.g., populate[transaction], filters[status][$eq]=published). Separate multiple parameters with &.',
  },
]);

const perform = (async (z, bundle) => {
  const { contentType, query, limit = 10, params: additionalParams } = bundle.inputData;

  // Prepare search parameters
  const searchParams: Record<string, any> = {
    'pagination[pageSize]': limit.toString(),
    'sort': 'createdAt:desc',
  };

  // Add search filter if query is provided
  if (query) {
    searchParams['filters[title][$containsi]'] = query;
    searchParams['filters[description][$containsi]'] = query;
  }

  // Parse and merge additional parameters if provided
  if (additionalParams && typeof additionalParams === 'string') {
    try {
      const urlParams = new URLSearchParams(additionalParams);
      urlParams.forEach((value, key) => {
        searchParams[key] = value;
      });
    } catch (error) {
      throw new Error(`Invalid parameters format. Use URL parameters (e.g., populate[transaction]). Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Get entries
  const response = await getEntries(z, bundle, contentType, searchParams);

  // Convert entries to Zapier format
  return response.data.map(convertStrapiEntryToZapier);
}) satisfies SearchPerform<InferInputData<typeof inputFields>>;

export default defineSearch({
  key: 'find_entry',
  noun: 'Entry',

  display: {
    label: 'Find Entry',
    description: 'Searches for entries in a Strapi content type.',
  },

  operation: {
    inputFields,
    perform,
    sample: {
      id: 1,
      title: 'Found Entry',
      description: 'This is a found entry',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      publishedAt: '2024-01-01T00:00:00.000Z',
    },
  },
}); 