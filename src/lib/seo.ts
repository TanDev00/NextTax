import { SITE_TITLE, SITE_DESCRIPTION } from './constants';

export function generateMeta(title?: string, description?: string) {
  const metaTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
  const metaDescription = description || SITE_DESCRIPTION;

  return {
    title: metaTitle,
    description: metaDescription,
  };
}
