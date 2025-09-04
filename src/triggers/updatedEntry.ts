import {
  defineInputFields,
  defineTrigger,
  type InferInputData,
  type PollingTriggerPerform,
} from 'zapier-platform-core';
import { getEntries, convertStrapiEntryToZapier } from '../utils.js';

const inputFields = defineInputFields([
  {
    key: 'contentType',
    type: 'string',
    required: true,
    label: 'Content Type',
    helpText: 'Select the content type to monitor for updated entries',
    dynamic: 'content_types.id.label',
  },
  {
    key: 'limit',
    type: 'integer',
    required: false,
    label: 'Limit',
    helpText: 'Maximum number of entries to return (default: 50)',
    default: '50',
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
  const { contentType, limit = 50, params } = bundle.inputData;

  // Prepare parameters
  const searchParams: Record<string, any> = {
    'pagination[pageSize]': limit.toString(),
    'sort': 'updatedAt:desc',
  };

  // Parse and merge additional parameters if provided
  if (params && typeof params === 'string') {
    try {
      const urlParams = new URLSearchParams(params);
      urlParams.forEach((value, key) => {
        searchParams[key] = value;
      });
    } catch (error) {
      throw new Error(`Invalid parameters format. Use URL parameters (e.g., populate[transaction]). Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Get recently updated entries for the selected content type
  const response = await getEntries(z, bundle, contentType, searchParams);


  // Convert entries to Zapier format and ensure each has an id
  return response.data.map(entry => ({
    id: entry.id.toString(),
    ...convertStrapiEntryToZapier(entry),
  }));
}) satisfies PollingTriggerPerform<InferInputData<typeof inputFields>>;

export default defineTrigger({
  key: 'updated_entry',
  noun: 'Entry',

  display: {
    label: 'Updated Entry',
    description: 'Triggers when an entry is updated in a Strapi content type.',
  },

  operation: {
    type: 'polling',
    inputFields,
    perform,
    sample: {
      id: 1,
      title: 'Updated Sample Entry',
      description: 'This is an updated sample entry',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      publishedAt: '2024-01-01T00:00:00.000Z',
    },
  },
}); 