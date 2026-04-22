import { WORDPRESS_API_URL } from '../lib/constants';
import { Post, Service, ServicePageData, AboutPageData, ContactPageData, HomePageData, FooterData, HeaderData, Category, JobListing } from '../types/wordpress';

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
    console.error("GRAPHQL ERRORS:", JSON.stringify(json.errors, null, 2));
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

export async function searchPosts(query: string): Promise<Post[]> {
  const searchTerm = query.trim();
  if (!searchTerm) return [];

  const data = await fetchAPI(`
    query SearchPosts($search: String!) {
      posts(first: 20, where: { search: $search }) {
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
  `, {
    variables: { search: searchTerm }
  });
  return data?.posts?.nodes || [];
}

export async function getAllCategories(): Promise<Category[]> {
  const data = await fetchAPI(`
    query AllCategories {
      categories {
        nodes {
          name
          slug
        }
      }
    }
  `);
  return data?.categories?.nodes || [];
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const data = await fetchAPI(`
    query PostsByCategory($categoryName: String!) {
      posts(first: 20, where: { categoryName: $categoryName, orderby: { field: DATE, order: DESC } }) {
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
  `, {
    variables: { categoryName: categorySlug }
  });
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
  const data = await fetchAPI(`
    query AllServices {
      services(first: 100) {
        nodes {
          id
          title
          slug
        }
      }
    }
  `);
  return data?.services?.nodes || [];
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  const data = await fetchAPI(`
    query ServiceBySlug($id: ID!, $idType: ServiceIdType!) {
      service(id: $id, idType: $idType) {
        id
        title
        slug
        content
      }
    }
  `, {
    variables: { id: slug, idType: 'SLUG' },
  });
  return data?.service;
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
                iconName
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

/* ───────── Home Page Data ───────── */

const HOME_QUERY = `
  query GetHomePage {
    page(id: "/", idType: URI) {
      homePageData {
        heroslides {
          title
          subtitle
          image {
            node {
              sourceUrl
            }
          }
          title2
          subtitle2
          address
          hotline
          website
          button1Text
          button1Link
          button2Text
          button2Link
        }
        partnersList {
          name
          logo {
            node {
              sourceUrl
            }
          }
        }
        servicesSection {
          badge
          title
          list {
            title
            description
            iconName
            tags
            backgroundImage {
              node {
                sourceUrl
              }
            }
            slug {
              url
              title
              target
            }
          }
        }
        aboutSection {
          badge
          title
          image {
            node {
              sourceUrl
            }
          }
          heading
          content
          signature {
            node {
              sourceUrl
            }
          }
          stats {
            value
            suffix
            label
          }
        }
        ctaSection {
          heading
          description
          background {
            node {
              sourceUrl
            }
          }
        }
        testimonialSection {
          badge
          title
          list {
            quote
            author
            company
            image {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;


export async function getHomePageData(): Promise<HomePageData | null> {
  const data = await fetchAPI(HOME_QUERY);
  const homeData = data?.page?.homePageData;
  if (!homeData) return null;

  return {
    ...homeData,
    heroSlides: homeData.heroslides || []
  };
}

/* ───────── Header Data ───────── */

export async function getHeaderData(): Promise<HeaderData | null> {
  try {
    const data = await fetchAPI(`
      query GetHeader {
        headerSettings {
          logoText
          logoIconText
          navItems {
            label
            url
            subitem {
              label
              url {
                target
                title
                url
              }
            }
          }
          ctaButton {
            label
            url
          }
        }
      }
    `);
    
    // Fallback if data is missing
    if (!data.headerSettings) return null;

    return data.headerSettings;
  } catch (error) {
    console.error('Error fetching header data:', error);
    return null;
  }
}

/* ───────── Footer Data ───────── */

export async function getFooterData(): Promise<FooterData | null> {
  try {
    const data = await fetchAPI(`
      query GetFooter {
         footerSettings {
            newsletter {
              title
              buttonText
              buttonUrl
            }
            columns {
              title
              links {
                label
                url
              }
            }
            contacts {
              email
              phone
              socials {
                platform
                url
              }
            }
            banner {
              text
              url
            }
            copyright
            legalLinks {
              label
              url
            }
          }
      }
    `);
    return data?.footerSettings || null;
  } catch (error) {
    return null;
  }
}

/* ───────── Job Listings Data ───────── */

export async function getJobListings(): Promise<JobListing[]> {
  const data = await fetchAPI(`
    query GetJobListings {
      jobListings(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          content
          jobTypes {
            nodes {
              name
            }
          }
          jobMeta {
            location
            salary
            company
            website
            application
            expires
            logo
          }
        }
      }
    }
  `);
  return data?.jobListings?.nodes || [];
}

export async function getJobBySlug(slug: string): Promise<JobListing | null> {
  const data = await fetchAPI(`
    query GetJobBySlug($id: ID!) {
      jobListing(id: $id, idType: SLUG) {
        id
        title
        slug
        date
        content
        jobTypes {
          nodes {
            name
          }
        }
        jobMeta {
          location
          salary
          company
          website
          application
          expires
          logo
        }
      }
    }
  `, { variables: { id: slug } });
  return data?.jobListing || null;
}
