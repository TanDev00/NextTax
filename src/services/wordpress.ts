import { WORDPRESS_API_URL } from '../lib/constants';
import type { Post, Page, Service } from '../types/wordpress';

async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Cấu hình Basic Auth từ .env
  const wpUsername = import.meta.env.WP_AUTH_USERNAME;
  const wpPassword = import.meta.env.WP_AUTH_PASSWORD;

  if (wpUsername && wpPassword) {
    headers['Authorization'] = `Basic ${btoa(`${wpUsername}:${wpPassword}`)}`;
  }

  const res = await fetch(WORDPRESS_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getAllPosts(): Promise<Post[]> {
  const data = await fetchAPI(`
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `);
  return data?.posts?.nodes || [];
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const data = await fetchAPI(`
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        id
        title
        slug
        date
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      }
    }
  `, {
    variables: { id: slug, idType: 'SLUG' },
  });
  return data?.post;
}

export async function getAllServices(): Promise<Service[]> {
  // Assuming services are a custom post type or a category of posts
  // For now, let's fetch from a specific category named 'services'
  const data = await fetchAPI(`
    query AllServices {
      posts(where: { categoryName: "services" }) {
        nodes {
          id
          title
          slug
          content
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `);
  return data?.posts?.nodes || [];
}
