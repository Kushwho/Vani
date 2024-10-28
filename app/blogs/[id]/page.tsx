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
        <div className="relative h-[60vh] w-full">
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
        <div className="max-w-[70vw] mx-auto my-6 px-8">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-3xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar>
                  <AvatarImage
                    src={urlFor(post.author.image.asset._ref).url()}
                    alt="Avatar"
                    className="rounded-full"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-sm text-gray-500 ml-4">
                  <div>{post.author.name}</div>
                  <div>{new Date(post.publishedAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-lg space-y-4">
                <PortableText
                  value={post.content}
                  components={myPortableTextComponents}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>An Error Occurred</>
      )}
    </div>
  );
}
