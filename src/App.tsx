import { FC } from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import axios, { Axios } from "axios";
import AxiosContext from "./Context/useAxiosContext";

const App: FC = () => {
  const instance = axios.create({
    withCredentials: true,
  });
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  return (
    <>
      <AxiosContext.Provider value={instance}>
        <RouterProvider router={router} /> 
      </AxiosContext.Provider>
    </>
  );
};

export default App;
