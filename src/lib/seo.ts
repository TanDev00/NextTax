import { SITE_TITLE, SITE_DESCRIPTION } from './constants';

/**
 * SEO Helper following the Astro Skill Blueprint
 */
export function generateSEO({ title, description }: { title?: string, description?: string }) {
  const metaTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
  const metaDescription = description || SITE_DESCRIPTION;

  return {
    title: metaTitle,
    description: metaDescription,
  };
}

// Keep generateMeta for backward compatibility if needed during refactor, but deprecated
export const generateMeta = (title?: string, description?: string) => generateSEO({ title, description });
