import { defineApp, version as platformVersion } from 'zapier-platform-core';
import packageJson from '../package.json' with { type: 'json' };

import authentication from './authentication.js';
import { befores, afters } from './middleware.js';
import { contentTypesHydrator } from './hydrators.js';

// Import triggers
import newEntryTrigger from './triggers/newEntry.js';
import updatedEntryTrigger from './triggers/updatedEntry.js';

// Import searches
import findEntrySearch from './searches/findEntry.js';
import { getContentTypesForDropdown } from './utils.js';

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
          label: "Content Types",
          description: "Content Types",
        },
      }
    }
  }
});
