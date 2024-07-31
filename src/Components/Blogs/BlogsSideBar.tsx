import React, { FC } from "react";
import { faker } from "@faker-js/faker";

const generateCategories = () => {
  const categories = Array.from({ length: 5 }, () =>
    faker.commerce.department()
  );
  return categories;
};

const generatePopularPosts = () => {
  const posts = Array.from({ length: 5 }, () => ({
    title: faker.lorem.sentence(),
    link: faker.internet.url(),
  }));
  return posts;
};

const BlogsSidebar: FC = () => {
 
  const popularPosts = generatePopularPosts();

  return (
    <aside className="md:w-1/4  max-md:hidden  py-6 pr-6   rounded-lg">
      <section>
        <h2 className="text-xl font-semibold mb-4 ">Popular Posts</h2>
        <ul className="space-y-4 text-[1.15rem]">
          {popularPosts.map((post, index) => (
            <li key={index}>
              <a href={post.link} className="text-primary-500 ">
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
