"use client";

import { useEffect, useState } from "react";
import BlogsCard, { BlogsCardProps } from "./components/card";
import client, { urlFor } from "@/lib/sanity-client";
import { LoadingState } from "./components/loadingState";
import { ErrorState } from "./components/errorState";
import BlogsSidebar from "./components/sidebar";
import { BlogShortResponse, PopularPostsResponse } from "@/types/blogs";

export default function Blogs() {
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);

      const [blogPosts, popularPosts] = await Promise.all([
        client.fetch<BlogShortResponse[]>(queryPostCard),
        client.fetch<PopularPostsResponse[]>(queryPopularPosts),
      ]);

      setPosts(
        blogPosts.map(
          (post): BlogsCardProps => ({
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

      setPopularPostTitle(
        popularPosts.map((post) => ({
          title: post.title,
          id: post._id,
        }))
      );
    } catch (error) {
      console.log(error);

      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState retry={fetchData} />;

  return (
    <div className="py-4 sm:py-8 px-4 h-full bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Mobile-first responsive layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 lg:justify-center">
          {/* Sidebar - hidden on mobile, shown on large screens */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <BlogsSidebar posts={popularPostTitle} />
          </aside>

          {/* Main content - full width on mobile, constrained on desktop */}
          <main className="flex-1 lg:max-w-2xl space-y-4">
            {posts.map((post) => (
              <BlogsCard key={post.id} {...post} />
            ))}
          </main>
        </div>

        {/* Mobile sidebar - shown at bottom on mobile */}
        <div className="lg:hidden mt-8">
          <BlogsSidebar posts={popularPostTitle} />
        </div>
      </div>
    </div>
  );
}
