"use client";

import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordVerifyProps {
  onPasswordChange: (_: string) => void;
  password: string;
  onVerifyPasswordChange: (_: string) => void;
  verifyPassword: string;
  errorMessageDisplay: {
    password: string | null;
    verifyPassword: string | null;
  };
  className?: string;
}

const PasswordVerify: FC<PasswordVerifyProps> = ({
  onPasswordChange,
  password,
  onVerifyPasswordChange,
  verifyPassword,
  errorMessageDisplay,
  className
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  return (
    <div className={cn("space-y-4", className)}>
      <FormItem>
        <FormLabel>Password</FormLabel>
        <div className="relative">
          <FormControl>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => {
                e.preventDefault();
                onPasswordChange(e.target.value);
              }}
              className={cn(
                "pr-10",
                errorMessageDisplay.password && "border-destructive"
              )}
            />
          </FormControl>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errorMessageDisplay.password && (
          <FormMessage>
            {errorMessageDisplay.password}
          </FormMessage>
        )}
      </FormItem>

      <FormItem>
        <FormLabel>Verify Password</FormLabel>
        <div className="relative">
          <FormControl>
            <Input
              type={showVerifyPassword ? "text" : "password"}
              placeholder="********"
              value={verifyPassword}
              onChange={(e) => {
                e.preventDefault();
                onVerifyPasswordChange(e.target.value);
              }}
              className={cn(
                "pr-10",
                errorMessageDisplay.verifyPassword && "border-destructive"
              )}
            />
          </FormControl>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowVerifyPassword(!showVerifyPassword)}
          >
            {showVerifyPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errorMessageDisplay.verifyPassword && (
          <FormMessage>
            {errorMessageDisplay.verifyPassword}
          </FormMessage>
        )}
      </FormItem>
    </div>
  );
};

export default PasswordVerify;