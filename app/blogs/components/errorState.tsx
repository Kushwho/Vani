"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { FC } from "react";

export const ErrorState: FC<{ retry?: () => void }> = ({ retry }) => {
  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-xl">Unable to Load Posts</CardTitle>
              <CardDescription>
                We encountered an error while loading the blog posts. This might
                be due to network issues or server unavailability.
              </CardDescription>
            </div>

            {retry && (
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
                <Button onClick={retry}>Try Again</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
