import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  FormEvent,
  FormEventHandler,
  useEffect,
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

import GetUser from "@/services/Login/GetUser.tsx";
import PhoneNumberInput from "@/Components/PhoneNo.tsx";
import PasswordVerify from "@/Components/PasswordVerfiy.tsx";
import { countryCodesObject } from "@/Components/Signup/CountryCode.tsx";

const Signup: FC = () => {
  const axios = useAxiosContext();
  const [displayOtp, setDisplayOtp] = useState<boolean>(false);
  const [formData, sendFormData] = useState<FormData>({
    fullname: "",

    password: "",
    phone: "",
    verifyPassword: "",
  });
  const [orderId, setOrderId] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>("+1"); // Default country code

  const navigate = useNavigate();

  const [errorMessageDisplay, setErrorMessageDisplay] =
    useState<ErrorMessageDisplay>({
      fullname: null,

      password: null,
      phone: null,
      verifyPassword: null,
    });

  useEffect(() => {
    axios
      .get("https://api.country.is/", { withCredentials: false })
      .then((data) => {
        setCountryCode(countryCodesObject[data.data.country].code);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

      password: null,
      verifyPassword: null,
      phone: null,
    });

    const data: SendOtpProps = {
      fullname: formData.fullname,

      password: formData.password,
      phone: `${countryCode}${formData.phone}`,
      // Include country code
    };

    if (displayOtp) {
      try {
        const rep = await VerifyOtp(
          {
            OTP: otp,
            phone: `${countryCode}${formData.phone}`,
            orderId,
          },
          axios
        );
        if (rep.data.isOTPVerified) {
          toast(
            "Signup Successful. Please provide your preferences on next page"
          );
          GetUser(undefined, axios);
          setOtpSent(true);
          setTimeout(() => {
            navigate("/onboarding");
          }, 1500);
        }

        // handle response by navigating to another page or so.
      } catch (error: any) {
        setOtpSent(false);
        toast(error?.message);
      }
    } else {
      try {
        toast.success("Sending otp");
        const response = await SendOtp(data, axios);
        setOrderId(response.data.orderId);
        setDisplayOtp(true);
      } catch (error: any) {
        console.error("Error sending OTP:", error);
        toast(error.message);
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
                Phone Number
              </label>
              <PhoneNumberInput
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
                phoneNumber={formData.phone}
                onPhoneNumberChange={(val: string) => {
                  sendFormData((prevValues) => {
                    return {
                      ...prevValues,
                      phone: val,
                    };
                  });
                }}
              />

              {errorMessageDisplay.phone && (
                <p className="text-red-500 text-xs">
                  {errorMessageDisplay.phone}
                </p>
              )}
            </div>
            {displayOtp && (
              <div className="otp-section flex flex-row items-center ">
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
                {displayOtp && !otpSent && (
                  <button
                    type="submit"
                    className="w-full ml-2 py-2  bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onClick={async () => {
                      toast.success("Resending otp");
                      const newOrderId = await ResendOtp(
                        {
                          orderId: orderId,
                        },
                        axios
                      );
                      setOrderId(newOrderId.data.orderId);
                      toast("Otp resent successfully");
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            )}
            <PasswordVerify
              password={formData.password}
              verifyPassword={formData.verifyPassword}
              onPasswordChange={(val: string) => {
                sendFormData((prevValues) => {
                  return {
                    ...prevValues,
                    password: val,
                  };
                });
              }}
              onVerifyPasswordChange={(val: string) => {
                sendFormData((prevValues) => {
                  return {
                    ...prevValues,
                    verifyPassword: val,
                  };
                });
              }}
              errorMessageDisplay={{
                password: errorMessageDisplay.password,
                verifyPassword: errorMessageDisplay.verifyPassword,
              }}
            />
            <div className="flex justify-between mt-8  items-center">
              <a className="outline-none underline" href="/login">
                Already have an account
              </a>
              <button
                type="submit"
                className="w-48 py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {displayOtp ? "Verify OTP" : otpSent ? "Resend OTP" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
