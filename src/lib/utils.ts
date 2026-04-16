/**
 * Extract slug from a WordPress URL or generate one from a title
 */
export function getSlugFromUrl(url: string | undefined, titleFallback?: string): string {
  if (url && url !== '#') {
    // Remove trailing slash if exists
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    
    // Get last segment
    const segments = cleanUrl.split('/');
    const lastSegment = segments[segments.length - 1];
    if (lastSegment) return lastSegment;
  }
  
  if (titleFallback) {
    return slugify(titleFallback);
  }

  return '';
}

/**
 * Simple slugify for Vietnamese
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
