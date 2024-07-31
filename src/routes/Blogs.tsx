import { FC } from "react";
import BlogsCard from "../Components/Blogs/BlogsCard";
import BlogsSidebar from "../Components/Blogs/BlogsSideBar";
import { faker } from "@faker-js/faker";

const Blogs: FC = () => {
  return (
    <div className="flex gap-12 justify-stretch items-stretch  w-screen max-w-6xl mx-auto min-h-screen h-full bg-white py-8 max-lg:px-6">
      <BlogsSidebar />
      <main className="flex-1 w-full h-full mx-auto px-6 flex flex-col items-center space-y-12 p-4">
        <div className="flex flex-col space-y-6">
          <BlogsCard
            id="1"
            author="Tari Ibaba"
            title="5 amazing new JavaScript features in ES15 (2024)"
            description="5 juicy ES15 features with new functionality for cleaner and shorter JavaScript code in 2024."
            date="Jun 2"
            imageUrl="https://via.placeholder.com/150"
            heroImage={faker.image.nature()}
          />
          <BlogsCard
            id="2"
            author="Tari Ibaba"
            title="5 amazing new JavaScript features in ES15 (2024)"
            description="5 juicy ES15 features with new functionality for cleaner and shorter JavaScript code in 2024."
            date="Jun 2"
            imageUrl="https://via.placeholder.com/150"
            heroImage={faker.image.nature()}
          />
          <BlogsCard
            id="3"
            author="Tari Ibaba"
            title="5 amazing new JavaScript features in ES15 (2024)"
            description="5 juicy ES15 features with new functionality for cleaner and shorter JavaScript code in 2024."
            date="Jun 2"
            imageUrl="https://via.placeholder.com/150"
            heroImage={faker.image.nature()}
          />
        </div>
      </main>
    </div>
  );
};

export default Blogs;
