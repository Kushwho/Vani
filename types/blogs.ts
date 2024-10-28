import { SanityImage } from "./sanity-image";

export interface BlogShortResponse {
  _id: string;
  title: string;
  mainImage: SanityImage;
  publishedAt: string;
  shortDescription: string;
  author: {
    name: string;
    image: SanityImage;
  };
}

export interface PopularPostsResponse {
  _id: string;
  title: string;
}
