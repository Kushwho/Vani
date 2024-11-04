export type SectionItem = {
  heading?: string;
  text?: string;
  items?: string[];
};

export type Section = {
  title: string;
  content: SectionItem[];
};
