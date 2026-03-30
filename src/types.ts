export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  benefits: string[];
  steps: string[];
  order?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  destination: string;
  program: string;
  content: string;
  avatar?: string;
  image?: string;
  date?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  author?: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface Branch {
  id: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  map_url?: string;
}

export interface SiteConfig {
  name: string;
  logo_url?: string;
  hero_title?: string;
  hero_description?: string;
  hero_image_url?: string;
  
  // Stats
  stats?: {
    success_rate: string;
    partners_count: string;
    students_count: string;
  };

  // Mission Section
  mission_title?: string;
  mission_text?: string;
  mission_quote?: string;
  mission_image_url?: string;

  // Why Choose Us
  why_title?: string;
  why_points?: {
    title: string;
    description: string;
  }[];
  why_image_url_1?: string;
  why_image_url_2?: string;

  about_text?: string;
  about_image_url?: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  branches?: Branch[];
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    twitter?: string;
  };
}
