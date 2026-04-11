import { WORDPRESS_API_URL } from './constants';

/**
 * Generic WordPress GraphQL fetch helper
 */
export async function wpQuery<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`WordPress GraphQL error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

/* ───────── Hero Slides ───────── */

export interface HeroSlide {
  title: string;
  subtitle: string;
  image: {
    node: {
      sourceUrl: string;
    };
  };
}

interface HeroQueryResult {
  page: {
    homePage: {
      heroSlides: HeroSlide[];
    };
  };
}

const HERO_QUERY = `
  query {
    page(id: "/", idType: URI) {
      homePage {
        heroSlides {
          title
          subtitle
          image {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const data = await wpQuery<HeroQueryResult>(HERO_QUERY);
  return data.page.homePage.heroSlides;
}
