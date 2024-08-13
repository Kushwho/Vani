import { useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import "@/styles/routes/blogs/blogDetails.module.scss";
import { PortableTextComponentProps } from "@portabletext/react";

import { faker } from "@faker-js/faker";
import client, { urlFor } from "@/services/SanityClient";
import { SanityImage } from "@/types/SanityImage.type";
import { PortableText } from "@portabletext/react";

import { myPortableTextComponents } from "@/Components/Blogs/MyPortableComponent";

interface BlogDetailResponse {
  _id: string;
  title: string;
  mainImage: SanityImage;
  publishedAt: string;
  content: any[];
  author: {
    name: string;
    image: SanityImage;
  };
}

const BlogDetail: FC = () => {
  const { id } = useParams();

  const [post, setPost] = useState<BlogDetailResponse | undefined>(undefined);
  const query = `*[_type == "blogPost" && _id == "${id}"]{_id, title, mainImage, publishedAt, content,author->{name, image}}`;

  useEffect(() => {
    client.fetch(query).then((fetchedPost: BlogDetailResponse[]) => {
      setPost(fetchedPost[0]);
      console.log(fetchedPost);
    });
  }, []);

  return (
    <div className="w-full bg-white ">
      {post ? (
        <img
          src={urlFor(post.mainImage.asset._ref).url()}
          className="w-full  max-md:max-h-[40vh] md:max-h-[60vh] mx-auto"
        />
      ) : (
        <></>
      )}
      {post ? (
        <div className="3xl:max-w-[70vw] max-3xl:max-w-[50vw] max-md:max-w-[90vw] max-lg:[70vw] w-full mx-auto max-md:p-8 my-6">
          <div className="mx-auto  ">
            <h1 className="twp">{post.title}</h1>

            <div className="w-full flex">
              <span>
                <img
                  src={urlFor(post.author.image.asset._ref).url()}
                  className="rounded-full h-10 w-10"
                />
              </span>
              <span className="text-sm text-gray-500 flex flex-col ml-4 mb-4">
                <span>{post.author.name}</span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </span>
            </div>

            <div className="text-lg space-y-4">
              <PortableText
                value={post.content}
                components={myPortableTextComponents}
              />
            </div>
          </div>
        </div>
      ) : (
        <>An Error Occured</>
      )}
    </div>
  );
};

export default BlogDetail;
