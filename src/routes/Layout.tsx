import React, { FC, useState, useEffect } from "react";
import Navbar from "../Components/Header";
import Footer from "../Components/Footer";
import { RouterProvider } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="w-screen">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
};

export default Layout;
