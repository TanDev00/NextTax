import { WORDPRESS_API_URL } from '../lib/constants';
import type { Post, Page, Service, ServicePageData, AboutPageData, ContactPageData } from '../types/wordpress';

async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  // Cấu hình Basic Auth từ .env
  const wpUsername = import.meta.env.WP_AUTH_USERNAME;
  const wpPassword = import.meta.env.WP_AUTH_PASSWORD;

  if (wpUsername && wpPassword) {
    // Ensure no spaces in Basic Auth
    const authString = `${wpUsername.trim()}:${wpPassword.trim()}`;
    headers['Authorization'] = `Basic ${btoa(authString)}`;
  }

  let retries = 3;
  let res;

  while (retries > 0) {
    try {
      res = await fetch(WORDPRESS_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      });
      if (res.ok) break;
    } catch (e) {
      retries--;
      if (retries === 0) throw e;
      console.log(`Fetch failed, retrying... (${retries} left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  if (!res) throw new Error('Failed to fetch after retries');

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error(`Failed to fetch API: ${JSON.stringify(json.errors)}`);
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
        databaseId
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
        comments {
          nodes {
            id
            date
            content
            author {
              node {
                name
              }
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

export async function submitComment(postId: number, author: string, authorEmail: string, content: string) {
  const data = await fetchAPI(`
    mutation CreateComment(
      $author: String!, 
      $authorEmail: String!, 
      $content: String!, 
      $commentOn: Int!
    ) {
      createComment(input: {
        author: $author,
        authorEmail: $authorEmail,
        content: $content,
        commentOn: $commentOn
      }) {
        success
        comment {
          id
          content
        }
      }
    }
  `, {
    variables: {
      author,
      authorEmail,
      content,
      commentOn: postId
    }
  });
  return data?.createComment;
}

export async function getServicePageData(): Promise<ServicePageData | null> {
  const data = await fetchAPI(`
    query ServicePage {
      page(id: "/service", idType: URI) {
        servicePage {
          heroBanner {
            title
            subtitle
            imageBanner {
              node {
                sourceUrl
              }
            }
          }
          service{
            title
            description
            listService{
                title
                description
                slug{
                    url 
                    title
                    target
                }
                icon_name
                price_value
                features{
                  feature  
                }
            }
          }
          whyChooseUs{
            title
            value_list{
                number
                sub_title
            }
            sub_title_1
            sub_title_2
            button{
                button_title
                buttonLink
            }
          }
          workFlow{
            tittle
            description
            flows{
                flow_step{
                    number_flow
                    title
                    description
                }
            }
            
          }
        }
      }
    }
  `);
  return data?.page?.servicePage;
}

export async function getAboutPageData(): Promise<AboutPageData | null> {
  const data = await fetchAPI(`
    query AboutPageQuery{
     page(id: "/about", idType: URI) {
        aboutPage {
          heroBanner {
            title
            description
            imageBanner{
                node {
                sourceUrl
              }
            }
          }
          introduction{
            title
            sub_title
            description
            button{
                button_title
                button_link
            }
            image{
               node {
                sourceUrl
              }  
            }
          }
          core_values{
            title
            sub_title
            description
            mission
            vision
            button{
                button_title
                button_link
            }
            image{
                 node {
                sourceUrl
              } 
            }
            core_values{
                professional
                reputation
                commit
                creative
            }
          }
          team{
            title
            sub_title
            description
            teamList{
                name
                position
                image{
                    node {
                        sourceUrl
                    }
                }
                facebook
                twitter
                youtube
            }
          }
          numbers{
            number
            description
          }
        }
      }
    }
  `,);
  return data?.page?.aboutPage || null;
}

export async function getContactPageData(): Promise<ContactPageData | null> {
  const data = await fetchAPI(`
   query ContactPageQuery{
     page(id: "/contact", idType: URI) {
        contactPage {
          hero_banner {
            title
            description
            imageBanner{
                node {
                sourceUrl
              }
            }
          }
          contact_information{
            title
            subTitle
            phone_number
            email
            address
          }
          businessHours{
            timeline
            time
          }
          linkInformation{
            facebook
            twitter
            intargram
            linkedin
          }
          faq{
            title
            content
          }
          map
        }
      }
    }
  `,);
  return data?.page?.contactPage || null;
}
