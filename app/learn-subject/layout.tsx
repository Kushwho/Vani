import React, { ReactNode } from "react";
import Navbar from "../components/Header";
import Footer from "../components/Footer";

interface layoutProps {
  children: ReactNode;
}

const layout: React.FC<layoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default layout;
