/**
 * Shared type definitions for the ISATech website
 */

// Navigation types
export interface NavLink {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

// Team/People types
export interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface Adviser {
  name: string;
  title: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageSize?: string;
}

// SEO types
export interface BreadcrumbItem {
  name: string;
  path: string;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Common component props
export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}

export interface SectionProps extends WithClassName {
  id?: string;
}
