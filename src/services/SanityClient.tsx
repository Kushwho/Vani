import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
const client = createClient({
  projectId: "s89ti6cn",
  dataset: "production",
  apiVersion: "2022-03-07", // use current UTC date - see "specifying API version"!
  useCdn: true, // `false` if you want to ensure fresh data
});

client.config().perspective = "published";

const builder = imageUrlBuilder(client);

export function urlFor(source: string) {
  return builder.image(source);
}
export default client;
