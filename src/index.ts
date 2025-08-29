import { defineApp, version as platformVersion } from 'zapier-platform-core';
import packageJson from '../package.json' with { type: 'json' };

import authentication from './authentication.js';
import { befores, afters } from './middleware.js';
import { contentTypesHydrator } from './hydrators.js';

// Import triggers
import newEntryTrigger from './triggers/newEntry.js';
import updatedEntryTrigger from './triggers/updatedEntry.js';

// Import creates
import createEntryAdvancedAction from './creates/createEntryAdvanced.js';

// Import searches
import findEntrySearch from './searches/findEntry.js';
import { getContentTypesForDropdown, getContentTypes, type StrapiAttribute } from './utils.js';

export default defineApp({
  version: packageJson.version,
  platformVersion,
  authentication,
  beforeRequest: [...befores],
  afterResponse: [...afters],
  // Hydrators
  hydrators: {
    contentTypes: contentTypesHydrator,
  },
  // Triggers
  triggers: {
    [newEntryTrigger.key]: newEntryTrigger,
    [updatedEntryTrigger.key]: updatedEntryTrigger,
  },
  // Creates
  creates: {
    [createEntryAdvancedAction.key]: createEntryAdvancedAction,
  },
  // Searches
  searches: {
    [findEntrySearch.key]: findEntrySearch,
  },
  resources: {
    "content_types": {
      key: "content_types",
      noun: "Content Type",
      list: {
        operation: {
          perform: getContentTypesForDropdown,
        },
        display: {
          hidden: true,
          label: "Content Types",
          description: "Lists all available content types in your Strapi instance.",
        },
      }
    },
    "content_type_fields": {
      key: "content_type_fields",
      noun: "Content Type Fields",
      list: {
        operation: {
          perform: async (z, bundle) => {
            const contentTypes = await getContentTypes(z, bundle);
            const fields: any[] = [];

            contentTypes.forEach(contentType => {
              Object.entries(contentType.schema.attributes).forEach(([fieldName, attribute]) => {
                const attr = attribute as StrapiAttribute;
                fields.push({
                  id: `${contentType.apiID}.${fieldName}`,
                  name: `${contentType.schema.displayName} - ${fieldName}`,
                  contentType: contentType.apiID,
                  fieldName: fieldName,
                  fieldType: attr.type,
                  required: attr.required || false,
                  description: `${contentType.schema.displayName} content type, field: ${fieldName} (${attr.type})`,
                });
              });
            });

            return fields;
          },
        },
        display: {
          label: "Content Type Fields",
          description: "Lists all available fields for each content type.",
        },
      }
    },
    "content_type_schema": {
      key: "content_type_schema",
      noun: "Content Type Schema",
      list: {
        operation: {
          perform: async (z, bundle) => {
            const contentTypes = await getContentTypes(z, bundle);
            return contentTypes.map(contentType => ({
              id: contentType.apiID,
              name: contentType.schema.displayName,
              schema: contentType.schema,
              fields: Object.entries(contentType.schema.attributes).map(([fieldName, attribute]) => {
                const attr = attribute as StrapiAttribute;
                return {
                  name: fieldName,
                  type: attr.type,
                  required: attr.required || false,
                  default: attr.default,
                  enum: attr.enum,
                  minLength: attr.minLength,
                  maxLength: attr.maxLength,
                  min: attr.min,
                  max: attr.max,
                };
              }),
            }));
          },
        },
        display: {
          label: "Content Type Schema",
          description: "Provides detailed schema information for each content type.",
        },
      }
    }
  }
});
