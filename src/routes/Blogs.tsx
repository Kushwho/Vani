import { FC, useEffect, useState } from "react";
import BlogsCard, { BlogsCardProps } from "../Components/Blogs/BlogsCard";
import BlogsSidebar from "../Components/Blogs/BlogsSideBar";
import client from "@/services/SanityClient";
import { urlFor } from "@/services/SanityClient"; // Ensure this is imported
import { SanityImage } from "@/types/SanityImage.type";
import Loader from "@/Components/Loader";

interface BlogShortResponse {
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

interface PopularPostsResponse {
  _id: string;
  title: string;
}

const Blogs: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [posts, setPosts] = useState<BlogsCardProps[]>([]);

  const [popularPostTitle, setPopularPostTitle] = useState<
    {
      title: string;
      id: string;
    }[]
  >([]);

  const queryPostCard =
    '*[_type == "blogPost"][0..9]{_id, title, mainImage, publishedAt, shortDescription,author->{name, image}}';

  const queryPopularPosts = '*[_type == "blogPost"][0..5]{_id, title}';

  useEffect(() => {
    client
      .fetch(queryPostCard)
      .then((fetchedPosts: BlogShortResponse[]) => {
        setPosts(
          fetchedPosts.map(
            (post: BlogShortResponse): BlogsCardProps => ({
              id: post._id,
              title: post.title,
              imageUrl: urlFor(post.author.image.asset._ref).url(),
              author: post.author.name,
              publishedAt: new Date(post.publishedAt).toLocaleDateString(),
              heroImage: urlFor(post.mainImage.asset._ref).url(),
              description: post.shortDescription,
            })
          )
        );
        setLoading(false);
      })
      .catch(() => {
        setError(true);
      });

    client
      .fetch(queryPopularPosts)
      .then((fetchedPosts: PopularPostsResponse[]) => {
        setPopularPostTitle(
          fetchedPosts.map((post: PopularPostsResponse) => ({
            title: post.title,
            id: post._id,
          }))
        );
      });
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        "an erro occured"
      ) : (

        <div className="flex gap-12 justify-stretch items-stretch w-screen max-w-6xl mx-auto min-h-screen h-full bg-white py-8 max-lg:px-6">
          <BlogsSidebar posts={popularPostTitle} />
          <main className="flex-1 w-full h-full mx-auto px-6 flex flex-col items-center space-y-12 p-4">
            <div className="flex flex-col space-y-6">
              {posts.map((post) => (
                <BlogsCard
                  key={post.id}
                  author={post.author}
                  title={post.title}
                  imageUrl={post.imageUrl}
                  publishedAt={post.publishedAt}
                  heroImage={post.heroImage}
                  id={post.id}
                  description={post.description}
                />
              ))}
            </div>
          </main>
          </div>

      )}
</>
  );
};

export default Blogs;
