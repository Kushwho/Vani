import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useWindowDimensions from "../../Hooks/useWindowDimensions";

interface BlogsCardProps {
  id: string;
  author: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  heroImage: string;
}

const BlogsCard: FC<BlogsCardProps> = ({
  id,
  author,
  title,
  description,
  date,
  imageUrl,
  heroImage,
}) => {
  const navigate = useNavigate();
  const window = useWindowDimensions();

  const data = {
    author: "Tari Ibaba",
    title: "5 amazing new JavaScript features in ES15 (2024)",
    description:
      "5 juicy ES15 features with new functionality for cleaner and shorter JavaScript code in 2024.",
    date: "Jun 2",
    imageUrl: "https://via.placeholder.com/150",
  };

  return (
    <div className=" rounded-lg  p-6 flex border border-orange-200 bg-white ">
      <div className="flex-shrink-0">
        <img className="rounded-full w-12 h-12" src={imageUrl} alt={author} />
      </div>
      <div className="ml-4 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">{author}</span>
        </div>
        <h3
          className="mt-2 text-xl font-semibold text-gray-900 hover:text-gray-700 cursor-pointer"
          onClick={() => {
            navigate(`/blogs/${id}`);
          }}
        >
          {title}
        </h3>
        <p className="mt-1 text-gray-700">{description}</p>
        <div className="mt-4 flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center">
            <span>{date}</span>
          </div>
        </div>
      </div>
      {window.dimensions.width > 768 ? (
        <div className="flex items-center justify-center mx-6">
          <img src={heroImage} className="w-40 h-32" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BlogsCard;
