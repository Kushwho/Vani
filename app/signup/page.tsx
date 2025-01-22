"use client";

import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { PostRegister, RegisterRequestData } from "@/lib/apis/otp/SendOtp";

import useAxiosContext from "@/hooks/custom/useAxiosContext";
import { countryCodesObject } from "../components/forms/CountryCode";
import { PostResendOtp } from "@/lib/apis/otp/ResendOtp";
import { PostVerifyOtp } from "@/lib/apis/otp/VerifyOtp";
import PhoneNumberInput from "../components/forms/PhoneNumberInput";
import PasswordVerify from "@/lib/form/PasswordVerify";
import { GetCountry } from "@/lib/apis/util/GetCountry";

const signupSchema = z
  .object({
    fullname: z.string().min(1, "Full name is required"),
    phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    verifyPassword: z.string(),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Passwords don't match",
    path: ["verifyPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const Signup: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const axios = useAxiosContext();

  const [isLoading, setIsLoading] = useState(false);
  const [displayOtp, setDisplayOtp] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [otp, setOtp] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      phone: "",
      password: "",
      verifyPassword: "",
    },
  });

  useEffect(() => {
    GetCountry({
      onSuccess: (response) => {
        setCountryCode(countryCodesObject[response.data.country].code);
      },
      onError: (error) => {
        console.log(error);
        
      },
    });
  }, [axios]);

  const handleOtpResend = async () => {
    try {
      setIsLoading(true);
      await PostResendOtp({
        axios,
        data: { orderId },
        onSuccess: (response) => {
          setOrderId(response.data.orderId);
          toast({
            title: "Success",
            description: "OTP resent successfully",
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: SignupFormData) => {
    try {
      setIsLoading(true);

      if (displayOtp) {
        await PostVerifyOtp({
          axios,
          data: {
            OTP: otp,
            phone: `${countryCode}${values.phone}`,
            orderId,
          },
          onSuccess: (response) => {
            if (response.data.isOTPVerified) {
              toast({
                title: "Success",
                description:
                  "Signup Successful. Please provide your preferences.",
              });
              router.push("/onboarding");
            }
          },
          onError: (error) => {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          },
        });
      } else {
        const registerData: RegisterRequestData = {
          fullname: values.fullname,
          password: values.password,
          phone: `${countryCode}${values.phone}`,
        };

        await PostRegister({
          axios,
          data: registerData,
          onSuccess: (response) => {
            setOrderId(response.data.orderId);
            setDisplayOtp(true);
            toast({
              title: "Success",
              description: "OTP sent successfully",
            });
          },
          onError: (error) => {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message,
            });
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex md:flex-row flex-col">
      <div className="relative md:w-2/5 w-full md:h-screen h-1/3 min-h-[300px]">
        <Image
          src="/images/login/bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-card" >
        <Card className="w-full max-w-md shadow-none border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Welcome to Vanii!
            </CardTitle>
            <CardDescription className="text-center">
              Speak Fluently, Connect Instantly
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneNumberInput
                          countryCode={countryCode}
                          onCountryCodeChange={setCountryCode}
                          phoneNumber={field.value}
                          onPhoneNumberChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {displayOtp && (
                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel>Enter OTP</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleOtpResend}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Resend OTP"
                          )}
                        </Button>
                      </div>
                    </FormItem>
                  </div>
                )}

                <PasswordVerify
                  password={form.watch("password")}
                  verifyPassword={form.watch("verifyPassword")}
                  onPasswordChange={(val) => form.setValue("password", val)}
                  onVerifyPasswordChange={(val) =>
                    form.setValue("verifyPassword", val)
                  }
                  errorMessageDisplay={{
                    password: form.formState.errors.password?.message || null,
                    verifyPassword:
                      form.formState.errors.verifyPassword?.message || null,
                  }}
                />

                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => router.push("/login")}
                    type="button"
                  >
                    Already have an account
                  </Button>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {displayOtp ? "Verify OTP" : "Sign Up"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
