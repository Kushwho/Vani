import { FC } from "react";
import { useNavigate } from "react-router";
import useWindowDimensions from "../../Hooks/useWindowDimensions";

export interface BlogsCardProps {
  id: string;
  author: string;
  title: string;
  description: string;
  publishedAt: string;
  imageUrl: string;
  heroImage: string;
}

const BlogsCard: FC<BlogsCardProps> = ({
  id:_,
  author,
  title,
  description,
  publishedAt,
  imageUrl,
  heroImage: mainImage,
}) => {
  const navigate = useNavigate();
  const window = useWindowDimensions();

  

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
            navigate(`/blogs/${title}`);
          }}
        >
          {title}
        </h3>
        <p className="mt-1 text-gray-700">{description}</p>
        <div className="mt-4 flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center">
            <span>{publishedAt}</span>
          </div>
        </div>
      </div>
      {window.dimensions.width > 768 ? (
        <div className="flex items-center justify-center mx-6">
          <img src={mainImage} className="w-[700px] h-32" alt="Img not found" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BlogsCard;
