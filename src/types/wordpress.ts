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

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
}

export interface Service {
  id: string;
  title: string;
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
  heroBanner: {
    title: string;
    description: string;
    imageBanner: string;
  };
  contactInformation: {
    phoneNumber: string;
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
