import { FC } from "react";

import { useNavigate } from "react-router";

type BlogsSideBarProps = {
  title: string;
  id: string;
}[];

const BlogsSidebar: FC<{ posts: BlogsSideBarProps }> = ({
  posts,
}: {
  posts: BlogsSideBarProps;
}) => {
  const navigate = useNavigate();

  return (
    <aside className="md:w-1/4  max-md:hidden  py-6 pr-6   rounded-lg">
      <section>
        <h2 className="text-xl font-semibold mb-4 ">Popular Posts</h2>
        <ul className="space-y-4 text-[1.15rem]">
          {posts.map((post, index) => (
            <li key={index}>
              <a
                onClick={() => {
                  navigate(`/blogs/${post.id}`);
                }}
                className="text-primary-500 "
              >
                {post.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default BlogsSidebar;
