import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Login from "./Login";
import Signup from "./Signup";
import Blogs from "./Blogs";
import BlogDetail from "./BlogsDetail";
import RecordBtn from "../Components/Recording/RecordButton";
import Record from "./Record";
import Home from "./Home";

const AppRoutes: FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/blogs"
            element={
              <Layout>
                <Blogs />
              </Layout>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <Layout>
                <BlogDetail />
              </Layout>
            }
          />

          <Route
            path="/record"
            element={
              <Layout>
                <Record />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
