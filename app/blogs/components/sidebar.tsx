"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";


interface BlogPost {
  title: string;
  id: string;
}

interface BlogsSidebarProps {
  posts: BlogPost[];
  className?: string;
}

const BlogsSidebar: FC<BlogsSidebarProps> = ({ posts }) => {
  const router = useRouter();

  return (
    <Card className="w-full sticky top-4 max-lg:hidden border-none shadow-none bg-transparent" >
      <CardHeader>
        <CardTitle className="text-left text-2xl text-primary">Popular Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[70vh]">
          <div className="space-y-2">
            {posts.map((post) => (
              <Button
                key={post.id}
                variant="ghost"
                className="w-full justify-start font-normal hover:bg-primary-50/50 h-auto py-2"
                onClick={() => router.push(`/blogs/${post.id}`)}
              >
                <span className="line-clamp-2 text-left break-words whitespace-normal hyphens-auto overflow-wrap-anywhere">
                  {post.title}
                </span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BlogsSidebar;
