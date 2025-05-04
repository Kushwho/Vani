"use client";

import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAuthContext from "@/hooks/custom/useAuthContext";
import useAxiosContext from "@/hooks/custom/useAxiosContext";
import { PostLogin } from "@/lib/apis/auth/Login";
import PhoneNumberInput from "../components/forms/PhoneNumberInput";
import { countryCodesObject } from "../components/forms/CountryCode";
import { GetCountry } from "@/lib/apis/util/GetCountry";
import GoogleWrapper from "../components/Google/GoogleWrapper";
import GoogleLogin from "../components/Google/GoogleLogin";


const formSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  password: z.string().min(1, "Password is required"),
});

const Login: FC = () => {
  const router = useRouter();
  const auth = useAuthContext();
  const axios = useAxiosContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const [countryCode, setCountryCode] = useState("+91");

  // Check if user is already logged in
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (auth?.config.loggedIn) {
        toast({
          title: "Already logged in",
          description: "You are already logged in. Navigating to Home Page",
        });
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [auth, router, toast]);

  // Fetch user's country code
  useEffect(() => {
      GetCountry({
        onSuccess: (response) => {
          setCountryCode(countryCodesObject[response.data.country].code);
        },
        onError: (error) => {
          console.log(error);
        }
      })
  }, [axios]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await PostLogin({
        axios,
        data: { ...values, phone: `${countryCode}${values.phone}` },
        onSuccess: (response) => {
          auth?.setConfig({
            loggedIn: true,
            id: response.data._id,
            email: response.data.email,
            voice: response.data.voice
          });

          toast({
            title: "Success",
            description: "Login Successful. Navigating to Home Page",
          });

          // Handle Google Analytics
          if ("dataLayer" in window) {
              /* eslint-disable  @typescript-eslint/no-explicit-any */
            (window as any).dataLayer.push({
              user_id: response.data._id,
            });
          }

          setTimeout(() => {
            router.push("/");
          }, 1500);
        },
        onError: (error) => {
          console.log(error);
          
          toast({
            variant: "destructive",
            title: "Error",
           // @ts-expect-error: data.message may not exist
            description: error.data.message || "An error occurred",
          });
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="h-full min-h-screen flex md:flex-row max-md:flex-col max-md:space-y-12 bg-card">
      <div className="relative md:w-3/5 md:h-screen max-md:w-full max-md:min-h-[300px] max-md:h-2/5">
        <Image
          src="/images/login/bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex items-center justify-center md:w-3/5 max-md:w-full p-8 ">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Log in to your account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <GoogleWrapper>
              <div className="mb-6">
                <GoogleLogin />
              </div>
            </GoogleWrapper>
            
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-primary"
                      onClick={() => router.push("/signup")}
                    >
                      Create account
                    </Button>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-primary block"
                      onClick={() => router.push("/forgotpassword")}
                    >
                      Forgot password
                    </Button>

                    
                  </div>

                  <Button type="submit">Sign in</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

