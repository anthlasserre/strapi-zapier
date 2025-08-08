import type { ZObject, Bundle } from 'zapier-platform-core';
import { getContentTypesForDropdown } from './utils.js';

// Hydrator for content types
export const contentTypesHydrator = async (z: ZObject, bundle: Bundle) => {
  const contentTypes = await getContentTypesForDropdown(z, bundle);

  // Transform to match Zapier's expected format for dynamic fields
  return contentTypes;
}; 