interface ContactLink {
  text: string;
  icon: React.ElementType;
  link: string;
}

export interface ContactInfo {
  title: string;
  links: ContactLink[];
}

export interface ImportantLink {
  title: string;
  link: string;
}

export interface ImportantLinks {
  title: string;
  elements: ImportantLink[];
}

export interface Section {
  id: number;
  title: string;
  content: string;
  imgUrl: string;
}

export interface Testimonial {
  avatar: string;
  message: string;
  name: string;
  position: string;
  industry: string;
}

export interface Plan {
  type: string;
  price: number;
  description: string[];
  button?: string;
}
