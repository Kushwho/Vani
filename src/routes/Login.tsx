import React, { ChangeEvent, ChangeEventHandler, FC, FormEvent, FormEventHandler, useState } from "react";
import bgImg from "../Images/bg.png";
import { useAxiosContext } from "../Context/useAxiosContext";

const Login: FC = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const axios = useAxiosContext();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await axios.post("/api/v1/user/login", formData);
      // Handle successful login 
      console.log("Login successful:", response.data);
    } catch (error) {
      setErrorMessage("An unknown error occured")
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex md:flex-row max-md:flex-col max-md:space-y-24">
        <div className="relative md:w-3/5 md:h-screen max-md:w-full max-md:h-2/5">
          <img src={bgImg} alt="bgImg" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center items-center md:w-3/5 max-md:w-full p-4">
          <div className="w-full max-w-md">
            <h2 className="text-3xl text-center mb-8">Log in to your account</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errorMessage && (
                <div className="mb-4">
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                </div>
              )}
              <div className="flex flex-row justify-between items-center mb-6">
                <a href="#" className="text-xl underline underline-offset-2 text-orange-500 hover:underline">
                  Create account
                </a>
                <button type="submit" className="px-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
