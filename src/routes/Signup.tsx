import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  FormEvent,
  FormEventHandler,
  useState,
} from "react";
import bgImg from "../Images/bg.png";
import {
  validateFormData,
  ErrorMessageDisplay,
  FormData,
} from "../services/ValidateSignupForm.ts";
import { useAxiosContext } from "../Hooks/useAxiosContext.tsx";
import { useNavigate } from "react-router";
import SendOtp, { SendOtpProps } from "@/services/OtpService/SendOtp.ts";
import VerifyOtp from "@/services/OtpService/VerifyOtp.ts";
import { toast } from "react-toastify";
import ResendOtp from "@/services/OtpService/ResendOtp.ts";

const Signup: FC = () => {
  const axios = useAxiosContext();
  const [displayOtp, setDisplayOtp] = useState<boolean>(false);
  const [formData, sendFormData] = useState<FormData>({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    verifyPassword: "",
  });
  const [orderId, setOrderId] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const navigate = useNavigate();

  const [errorMessageDisplay, setErrorMessageDisplay] =
    useState<ErrorMessageDisplay>({
      fullname: null,
      email: null,
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

    const { isValid, errors } = validateFormData(formData);
    if (!isValid) {
      setErrorMessageDisplay(errors);
      return;
    }

    setErrorMessageDisplay({
      fullname: null,
      email: null,
      password: null,
      verifyPassword: null,
      phone: null,
    });

    const data: SendOtpProps = {
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    };

    if (displayOtp) {
      try {
        const rep = await VerifyOtp(
          {
            OTP: otp,
            phone: formData.phone,
            orderId,
          },
          axios
        );
        if (rep.data.isOtpVerified) {
          toast("Log in Successful.Navigating to login page");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }

        // handle response by navigating to another page or so.
      } catch (error: any) {
        toast(error?.message);
      }
    } else {
      if (otpSent) {
        const newOrderId = await ResendOtp(
          {
            orderId: orderId,
          },
          axios
        );
        setOrderId(newOrderId.data.orderId);
        toast("Otp resent successfully");
      } else {
        try {
          const response = await SendOtp(data, axios);
          setOrderId(response.data.orderId);
          setDisplayOtp(true);
          setOtpSent(true);
        } catch (error: any) {
          console.error("Error sending OTP:", error);
          toast(error.message);
        }
      }
    }
  };

  return (
    <div className="w-full h-screen flex md:flex-row flex-col space-y-8">
      <div className="relative md:w-2/5 w-full md:h-full h-2/5">
        <img src={bgImg} alt="bgImg" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-center items-center md:w-3/5 w-full p-4">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-4">
            Welcome to Vanii!
          </h2>
          <p className="text-center text-base mb-8">
            Speak Fluently, Connect Instantly
          </p>
          <div className="w-3/12 mx-auto border-t-2 border-orange-500 mb-8"></div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                placeholder="Your fullname"
                className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.fullname}
                onChange={handleChange}
              />
              {errorMessageDisplay.fullname && (
                <p className="text-red-500 text-xs">
                  {errorMessageDisplay.fullname}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Id
              </label>
              <input
                type="text"
                name="email"
                placeholder="Your email Id"
                className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.email}
                onChange={handleChange}
              />
              {errorMessageDisplay.email && (
                <p className="text-red-500 text-xs">
                  {errorMessageDisplay.email}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
                <p className="text-red-500 text-xs">
                  {errorMessageDisplay.phone}
                </p>
              )}
            </div>
            {displayOtp && (
              <div className="otp-section">
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
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
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
                <p className="text-red-500 text-xs">
                  {errorMessageDisplay.password}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-700 mb-1">
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
                <p className="text-red-500 text-xs">
                  {errorMessageDisplay.verifyPassword}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center mb-6">
              <a
                href="#"
                className="text-base underline underline-offset-2 text-orange-500 hover:underline"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Already have an account?
              </a>
              <button
                type="submit"
                className="px-4 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 text-sm"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
