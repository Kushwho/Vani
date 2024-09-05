import { FC, FormEvent, ReactElement, useState } from "react";
import bgImg from "../Images/bg.png";
import PhoneNumberInput from "@/Components/PhoneNo";
import PasswordVerify, {
  PasswordVerifyProps,
} from "@/Components/PasswordVerfiy";
import {
  SendOTPForgotPassword,
  SendPasswordWithOtp,
} from "@/services/Login/ForgotPassword";

import { useAxiosContext } from "@/Hooks/useAxiosContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

interface ForgotPasswordProps {}
interface PhoneNo {
  countryCode: string;
  phoneNo: string;
}

const ForgotPassword: FC<ForgotPasswordProps> = (): ReactElement => {
  const [phoneData, setPhoneData] = useState<PhoneNo>({
    countryCode: "",
    phoneNo: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordVerifyProps>({
    password: "",
    verifyPassword: "",
    onPasswordChange: (_) => null,
    onVerifyPasswordChange: (_) => null,
    errorMessageDisplay: {
      password: "",
      verifyPassword: "",
    },
  });
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [OTP, setOTP] = useState<string>("");
  const [orderId, setOrderId] = useState<string | null>(null);

  const [buttonStates, setButtonStates] = useState<{
    sendOTP: boolean;
    changePassword: boolean;
  }>({
    sendOTP: false,
    changePassword: false,
  });
  const axios = useAxiosContext();

  const sendOTP = async (_: FormEvent) => {
    console.log("hello wolr");

    setButtonStates({
      sendOTP: false,
      changePassword: false,
    });
    toast.success("sending OTP");
    const resp = await SendOTPForgotPassword({
      phone: `${phoneData.countryCode}${phoneData.phoneNo}`,
      axios: axios,
    });
    setOrderId(resp.data.orderId);
    setOtpSent(true);
  };
  const navigate = useNavigate();

  const changePassword = async (_: FormEvent) => {
    setButtonStates({
      sendOTP: false,
      changePassword: false,
    });
    toast.success("Changing Password");
    if (orderId != null) {
      const resp = await SendPasswordWithOtp({
        phone: `${phoneData.countryCode}${phoneData.phoneNo}`,
        orderId: orderId,
        OTP: OTP,
        newPassword: passwordData.password,
        axios: axios,
      })
        .then((msg) => {
          if (msg.success) {
            toast.success(
              "Password changed successfully.Navigating to login page"
            );
            setTimeout(() => {
              navigate("/login");
            }, 1500);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
      console.log(resp);
    }
  };

  return (
    <>
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
            <form>
              <div className="mb-4">
                {!otpSent ? (
                  <>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <PhoneNumberInput
                      onCountryCodeChange={(val) => {
                        setPhoneData((prevValues) => {
                          return {
                            ...prevValues,
                            countryCode: val,
                          };
                        });
                      }}
                      onPhoneNumberChange={(val) => {
                        if (val.length === 10) {
                          setButtonStates({
                            sendOTP: true,
                            changePassword: false,
                          });
                        } else {
                          if (buttonStates.sendOTP) {
                            setButtonStates({
                              sendOTP: false,
                              changePassword: false,
                            });
                          }
                        }
                        setPhoneData((prevValues) => {
                          return {
                            ...prevValues,
                            phoneNo: val,
                          };
                        });
                      }}
                      phoneNumber={phoneData.phoneNo}
                      countryCode={phoneData.countryCode}
                    />
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        className="w-full px-3 py-2 border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={OTP}
                        onChange={(event) => {
                          setOTP(event.target.value);
                        }}
                      />
                    </div>
                    <PasswordVerify
                      onPasswordChange={(val: string) => {
                        setPasswordData((prevVals) => {
                          return {
                            ...prevVals,
                            password: val,
                          };
                        });
                      }}
                      password={passwordData.password}
                      verifyPassword={passwordData.verifyPassword}
                      onVerifyPasswordChange={(val: string) => {
                        if (
                          passwordData.password.length >= 8 &&
                          passwordData.password === val &&
                          OTP.length >= 6
                        ) {
                          setButtonStates({
                            sendOTP: false,
                            changePassword: true,
                          });
                        } else {
                          setButtonStates({
                            sendOTP: false,
                            changePassword: false,
                          });
                        }
                        setPasswordData((prevVals) => {
                          return {
                            ...prevVals,
                            verifyPassword: val,
                          };
                        });
                      }}
                      errorMessageDisplay={{
                        password: passwordData.errorMessageDisplay.password,
                        verifyPassword:
                          passwordData.errorMessageDisplay.verifyPassword,
                      }}
                    />
                  </>
                )}
              </div>
              <button
                type="button"
                className={`w-48 py-2  font-bold rounded-md  focus:outline-none focus:ring-2 focus:ring-orange-500 
                  ${
                    otpSent
                      ? buttonStates.changePassword
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : buttonStates.sendOTP
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }
                  
                  `}
                onClick={(event) => {
                  otpSent ? changePassword(event) : sendOTP(event);
                }}
              >
                {otpSent ? "Change Password" : "Send OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
