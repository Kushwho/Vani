import React, {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  FormEvent,
  FormEventHandler,
  useState,
} from "react";
import bgImg from "../Images/bg.png";
import { useAxiosContext } from "../Context/useAxiosContext";

interface sendOtp {
  username: string;
  password: string;
  phone: string;
}

interface sendOtpResponse {
  orderId: string;
}

interface verifyOtp {
  OTP: string;
  phone: string;
  orderId: string;
}

interface resendOtpRequest {
  orderId: string;
}

const Signup: FC = () => {
  const axios = useAxiosContext();
  const [displayOtp, setDisplayOtp] = useState<boolean>(false);
  const [formData, sendFormData] = useState<
    sendOtp & { verifyPassword: string }
  >({ username: "", password: "", phone: "", verifyPassword: "" });
  const [orderId, setOrderId] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const [errorMessageDisplay, setErrorMessageDisplay] = useState<{
    username: string | null;
    password: string | null;
    phone: string | null;
    verifyPassword: string | null;
  }>({
    username: null,
    password: null,
    phone: null,
    verifyPassword: null,
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    sendFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleOtpChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setOtp(event.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    let isInvalid = false;
    if (formData.username.trim().length === 0) {
      setErrorMessageDisplay((prevData) => {
        return { ...prevData, username: "Please enter a valid username" };
      });
      isInvalid = true;
    }
    if (formData.phone.length !== 10) {
      setErrorMessageDisplay((prevData) => {
        return { ...prevData, phone: "Please enter a valid phone number" };
      });
      isInvalid = true;
    }
    if (formData.password !== formData.verifyPassword) {
      setErrorMessageDisplay((prevData) => {
        return {
          ...prevData,
          verifyPassword: "Password does not match",
          password: "Password does not match",
        };
      });
      isInvalid = true;
    }
    if (isInvalid) return;
    setErrorMessageDisplay({
      username: null,
      password: null,
      verifyPassword: null,
      phone: null,
    });

    const data: sendOtp = {
      username: formData.username,
      password: formData.password,
      phone: formData.phone,
    };

    if (displayOtp) {
      try {
        const response = await axios.post<verifyOtp>("api/v1/user/verify", {
          OTP: otp,
          phone: formData.phone,
          orderId: orderId,
        });

        //handle response by navigating to other page or so.
      } catch (error) {}
    } else {
      if (otpSent) {
        handleResendOtp();
      } else {
        try {
          const response = await axios.post<sendOtpResponse>(
            "/api/v1/user/",
            data
          );
          const { orderId } = response.data;
          setOrderId(orderId);
          setDisplayOtp(true);
          setOtpSent(true);
        } catch (error) {
          // Handle the error via toast or other way
        }
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post<resendOtpRequest>(
        "/api/v1/user/resend-otp",
        {
          orderId,
        }
      );
      setOrderId(response.data.orderId);
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex md:flex-row flex-col space-y-8">
        <div className="relative md:w-2/5 w-full md:h-full h-2/5">
          <img src={bgImg} alt="bgImg" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center items-center md:w-3/5 w-full p-4">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-center mb-4">
              Welcome to Vanii!
            </h2>
            <p className="text-center text-lg mb-8">
              Speak Fluently, Connect Instantly
            </p>
            <div className="w-3/12 mx-auto border-t-2 border-orange-500 mb-8"></div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Your preferred name"
                  className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errorMessageDisplay.username && (
                  <p className="text-red-500 text-sm">
                    {errorMessageDisplay.username}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="number"
                  name="phone"
                  placeholder="10 digit phone number"
                  className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errorMessageDisplay.phone && (
                  <p className="text-red-500 text-sm">
                    {errorMessageDisplay.phone}
                  </p>
                )}
              </div>
              {displayOtp && (
                <div className="otp-section">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={otp}
                      onChange={handleOtpChange}
                    />
                  </div>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errorMessageDisplay.password && (
                  <p className="text-red-500 text-sm">
                    {errorMessageDisplay.password}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="verifyPassword"
                  placeholder="********"
                  className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={formData.verifyPassword}
                  onChange={handleChange}
                />
                {errorMessageDisplay.verifyPassword && (
                  <p className="text-red-500 text-sm">
                    {errorMessageDisplay.verifyPassword}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center mb-6">
                <a
                  href="#"
                  className="text-xl underline underline-offset-2 text-orange-500 hover:underline"
                >
                  Already have an account?
                </a>
                <button
                  type="submit"
                  className="px-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
