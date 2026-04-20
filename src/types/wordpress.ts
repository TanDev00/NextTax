export interface Post {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  categories: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
  author: {
    node: {
      name: string;
      avatar?: {
        url: string;
      };
    };
  };
  comments?: {
    nodes: Array<{
      id: string;
      date: string;
      content: string;
      author?: {
        node?: {
          name: string;
          avatar?: {
            url: string;
          };
        };
      };
    }>;
  };
}

export interface Category {
  name: string;
  slug: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
}

export interface JobListing {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  jobTypes: {
    nodes: {
      name: string;
    }[];
  };
  jobMeta: {
    location: string;
    salary: string;
    company: string;
    website: string;
    application: string;
    expires: string;
    logo: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  slug: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

export interface ServicePageData {
  heroBanner: {
    title: string;
    subtitle: string;
    imageBanner: {
      node: {
        sourceUrl: string;
      };
    };
  };
  service: {
    title: string;
    description: string;
    listService: Array<{
      title: string;
      description: string;
      slug: {
        url: string;
      } | string;
      iconName: string;
      priceValue: string;
      features: Array<{
        feature: string;
      }>;
    }>;
  };
  whyChooseUs: {
    title: string;
    subTitle1: string;
    subTitle2: string;
    valueList: Array<{
      number: string;
      subTitle: string;
    }>;
    button: {
      buttonTitle: string;
      buttonLink: string;
    };
  };
  workFlow: {
    tittle: string;
    description: string;
    flows: Array<{
      flowStep: {
        number_flow: string;
        title: string;
        description: string;
      };
    }>;
  };
}

export interface AboutPageData {
  heroBanner: {
    title: string;
    description: string;
    imageBanner: {
      node: {
        sourceUrl: string;
      };
    };
  };
  introduction: {
    title: string;
    sub_title: string;
    description: string;
    button: {
      button_title: string;
      button_link: string;
    };
    image: {
      node: {
        sourceUrl: string;
      };
    };
  };
  core_values: {
    title: string;
    sub_title: string;
    description: string;
    mission: string;
    vision: string;
    image: {
      node: {
        sourceUrl: string;
      };
    };
    button: {
      buttonTitle: string;
      buttonLink: string;
    };
    coreValues: {
      professional: string;
      reputation: string;
      commit: string;
      creative: string;
    };
  };
  team: {
    title: string;
    sub_title: string;
    description: string;
    teamList: Array<{
      name: string;
      position: string;
      image: {
        node: {
          sourceUrl: string;
        };
      }
      facebook: string;
      twitter: string;
      youtube: string
    }>
  };
  numbers: {
    number: string;
    description: string;
  }
}

export interface ContactPageData {
  hero_banner: {
    title: string;
    description: string;
    imageBanner: { node: { sourceUrl: string } };
  };
  contact_information: {
    title: string;
    subTitle: string;
    phone_number: string;
    email: string;
    address: string;
  };
  businessHours: Array<{
    timeline: string;
    time: string;
  }>;
  linkInformation: {
    facebook: string;
    twitter: string;
    intargram: string;
    linkedin: string;
  };
  faq: Array<{
    title: string;
    content: string;
  }>;
  map: string | null | undefined
}

/* ───────── Home Page Interfaces ───────── */

export interface HeroSlide {
  title: string;
  subtitle: string;
  image: {
    node: {
      sourceUrl: string;
    };
  };
  title2: string;
  subtitle2: string;
}

export interface Partner {
  name: string;
  logo: {
    node: {
      sourceUrl: string;
    } | null;
  } | null;
}

export interface ServiceItem {
  title: string;
  description: string;
  iconName: string;
  tags: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  company: string;
  image: {
    node: {
      sourceUrl: string;
    };
  };
}

export interface HomePageData {
  heroSlides: HeroSlide[];
  partnersList: Partner[];
  servicesSection: {
    badge: string;
    title: string;
    list: ServiceItem[];
  };
  aboutSection: {
    badge: string;
    title: string;
    image: {
      node: {
        sourceUrl: string;
      };
    };
    heading: string;
    content: string;
    signature: {
      node: {
        sourceUrl: string;
      } | null;
    } | null;
    stats: StatItem[];
  };
  ctaSection: {
    heading: string;
    description: string;
    background: {
      node: {
        sourceUrl: string;
      };
    };
  };
  testimonialSection: {
    badge: string;
    title: string;
    list: TestimonialItem[];
  };
}
/* ───────── Shared Interfaces ───────── */

export interface Link {
  label: string;
  url: string;
}

/* ───────── Header Interfaces ───────── */

/** ACF link field object (returned by get_field on a Link field) */
export interface NavLinkField {
  target: string;
  title: string;
  url: string;
}

export interface NavSubItem {
  label: string;
  url: NavLinkField;
}

export interface NavItem {
  label: string;
  url: string; // Top level URL is string (from simple ACF field)
  subitem?: NavSubItem[];
}

export interface HeaderData {
  logoText: string;
  logoIconText: string;
  navItems: NavItem[];
  ctaButton: {
    label: string;
    url: string;
  };
}

/* ───────── Footer Interfaces ───────── */

export interface FooterData {
  newsletter: {
    title: string;
    buttonText: string;
    buttonUrl: string;
  };
  columns: Array<{
    title: string;
    links: Link[];
  }>;
  contacts: {
    email: string;
    phone: string;
    socials: Array<{
      platform: string;
      url: string;
    }>;
  };
  banner: {
    text: string;
    url: string;
  };
  copyright: string;
  legalLinks: Link[];
}
