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
