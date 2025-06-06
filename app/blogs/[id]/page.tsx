"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import client, { urlFor } from "@/lib/sanity-client";
import { SanityImage } from "@/types/sanity-image";
import { PortableText } from "@portabletext/react";

import { myPortableTextComponents } from "./components/MyPortableComponent";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

interface BlogDetailResponse {
  _id: string;
  title: string;
  mainImage: SanityImage;
  publishedAt: string;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  content: any[]; 
  author: {
    name: string;
    image: SanityImage;
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogDetailResponse | undefined>(undefined);

  useEffect(() => {
    const fetchPost = async () => {
      const query = `*[_type == "blogPost" && _id == "${params.id}"]{_id, title, mainImage, publishedAt, content,author->{name, image}}`;
      const fetchedPost: BlogDetailResponse[] = await client.fetch(query);
      setPost(fetchedPost[0]);
    };
    fetchPost();
  }, [params.id]);

  return (
    <div className="w-full bg-white">
      {post ? (
        <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] w-full">
          <Image
            src={urlFor(post.mainImage.asset._ref).url()}
            alt="Hero Image"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <></>
      )}
      {post ? (
        <div className="max-w-4xl mx-auto my-4 sm:my-6 px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-none">
            <CardHeader className="px-0 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl leading-tight">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <div className="flex items-center mb-4 sm:mb-6">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage
                    src={urlFor(post.author.image.asset._ref).url()}
                    alt="Avatar"
                    className="rounded-full"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-sm text-gray-500 ml-3 sm:ml-4">
                  <div className="font-medium">{post.author.name}</div>
                  <div>{new Date(post.publishedAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-base sm:text-lg space-y-4 leading-relaxed">
                <PortableText
                  value={post.content}
                  components={myPortableTextComponents}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">An Error Occurred</h2>
            <p className="text-gray-600">Unable to load the blog post.</p>
          </div>
        </div>
      )}
    </div>
  );
}
