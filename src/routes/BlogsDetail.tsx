import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { useParams } from "react-router";
import "../styles/blogDetails.scss";

import { faker } from "@faker-js/faker";

interface BlogDetailResponse {
  id: number;
  title: string;
  body: string;
  author: string;
  dateOfPublication: string;
  authorImageUrl: string;
  heroImageUrl: string;
}

const generateRandomBlog = (): BlogDetailResponse => {
  return {
    id: faker.datatype.number({ min: 1, max: 1000 }),
    title: faker.lorem.sentence(),
    body: `
     

      <h2>${faker.lorem.sentence()}</h2>
      <p>${faker.lorem.paragraph()}</p>
      <h3>${faker.lorem.sentence()}</h3>
      <ul style ="list:type">
        <li>${faker.lorem.sentence()}</li>
        <li>${faker.lorem.sentence()}</li>
        <li>${faker.lorem.sentence()}</li>
        
      </ul>
       <img src=${faker.image.urlLoremFlickr()}/>
      <p>${faker.lorem.paragraph()}</p>
      <img src=${faker.image.urlLoremFlickr()}/>
            <img src=${faker.image.urlLoremFlickr()}/>
    `,
    author: faker.name.firstName(),
    dateOfPublication: faker.date.past().toLocaleString(),
    authorImageUrl: faker.image.avatar(),
    heroImageUrl: faker.image.urlPicsumPhotos(),
  };
};

const BlogDetail: FC = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery<BlogDetailResponse, Error>({
    queryKey: ["blogdetails", id],
    //TODO
    queryFn: () => {
      return generateRandomBlog();
    },
  });
  return (
    <div className="w-full bg-white ">
      {data ? (
        <img
          src={data.heroImageUrl}
          className="w-full  max-md:max-h-[40vh] md:max-h-[60vh] mx-auto"
        />
      ) : (
        <></>
      )}
      {data ? (
        <div className="3xl:max-w-[70vw] max-3xl:max-w-[50vw] max-md:max-w-[90vw] max-lg:[70vw] w-full mx-auto max-md:p-8 my-6">
          <div className="mx-auto  ">
            <h1 className="twp">{data.title}</h1>

            <div className="w-full flex">
              <span>
                <img
                  src={data.authorImageUrl}
                  className="rounded-full h-10 w-10"
                />
              </span>
              <span className="text-sm text-gray-500 flex flex-col ml-4">
                <span>{data.author}</span>
                <span>Published on {data.dateOfPublication}</span>
              </span>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: data.body }}
              className="twp "
            ></div>
          </div>
        </div>
      ) : (
        <>An Error Occured</>
      )}
    </div>
  );
};

export default BlogDetail;
