"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import useAxiosContext from "@/hooks/custom/useAxiosContext";
import { PostSendOTP, PostResetPassword } from "@/lib/apis/otp/Password";
import PhoneNumberInput from "../components/forms/PhoneNumberInput";
import PasswordVerify from "@/lib/form/PasswordVerify";
import { countryCodesObject } from "../components/forms/CountryCode";
import { GetCountry } from "@/lib/apis/util/GetCountry";

const phoneFormSchema = z.object({
  phone: z.string().min(10, "Phone number must be 10 digits"),
});

const resetPasswordFormSchema = z
  .object({
    otp: z.string().min(6, "OTP must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    verifyPassword: z.string(),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Passwords don't match",
    path: ["verifyPassword"],
  });

type PhoneFormValues = z.infer<typeof phoneFormSchema>;
type ResetFormValues = z.infer<typeof resetPasswordFormSchema>;

const ForgotPassword: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const axios = useAxiosContext();

  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [orderId, setOrderId] = useState<string | null>(null);

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      otp: "",
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

  const onSendOTP = async (values: PhoneFormValues) => {
    try {
      setIsLoading(true);
      await PostSendOTP({
        axios,
        data: {
          phone: `${countryCode}${values.phone}`,
        },
        onSuccess: (response) => {
          setOrderId(response.data.orderId);
          setOtpSent(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (values: ResetFormValues) => {
    if (!orderId) return;

    try {
      setIsLoading(true);
      await PostResetPassword({
        axios,
        data: {
          phone: `${countryCode}${phoneForm.getValues().phone}`,
          orderId,
          OTP: values.otp,
          newPassword: values.password,
        },
        onSuccess: () => {
          toast({
            title: "Success",
            description:
              "Password changed successfully. Redirecting to login...",
          });
          setTimeout(() => router.push("/login"), 1500);
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

  return (
    <div className="min-h-screen flex md:flex-row flex-col bg-card">
      <div className="relative md:w-2/5 w-full md:h-screen max-md:h-1/3 max-md:min-h-[20rem]">
        <Image
          src="/images/login/bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="md:flex-1 flex items-center justify-center p-6 " >
        <Card className="w-full max-w-md shadow-none border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your phone number to receive an OTP
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!otpSent ? (
              <Form {...phoneForm}>
                <form
                  onSubmit={phoneForm.handleSubmit(onSendOTP)}
                  className="space-y-4"
                >
                  <FormField
                    control={phoneForm.control}
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Send OTP
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...resetForm}>
                <form
                  onSubmit={resetForm.handleSubmit(onResetPassword)}
                  className="space-y-4"
                >
                  <FormField
                    control={resetForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter OTP</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter OTP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <PasswordVerify
                    password={resetForm.watch("password")}
                    verifyPassword={resetForm.watch("verifyPassword")}
                    onPasswordChange={(val) =>
                      resetForm.setValue("password", val)
                    }
                    onVerifyPasswordChange={(val) =>
                      resetForm.setValue("verifyPassword", val)
                    }
                    errorMessageDisplay={{
                      password:
                        resetForm.formState.errors.password?.message || null,
                      verifyPassword:
                        resetForm.formState.errors.verifyPassword?.message ||
                        null,
                    }}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Reset Password
                  </Button>
                </form>
              </Form>
            )}

            <Button
              variant="link"
              type="button"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
