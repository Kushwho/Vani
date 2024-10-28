"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/custom/useMediaQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface BlogsCardProps {
  id: string;
  author: string;
  title: string;
  description: string;
  publishedAt: string;
  imageUrl: string;
  heroImage: string;
  className?: string;
}

const BlogsCard: FC<BlogsCardProps> = ({
  id,
  author,
  title,
  description,
  publishedAt,
  imageUrl,
  heroImage,
  className,
}) => {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Get author initials for avatar fallback
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow duration-200",
        className
      )}
      onClick={() => router.push(`/blogs/${id}`)}
    >
      <CardContent className="p-6 flex gap-4">
        <div className="flex-shrink-0">
          <Avatar className="w-12 h-12">
            <AvatarImage src={imageUrl} alt={author} />
            <AvatarFallback>{getInitials(author)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-grow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{author}</span>
            <span className="text-xs text-muted-foreground">{publishedAt}</span>
          </div>

          <CardTitle className="cursor-pointer hover:text-primary transition-colors">
            {title}
          </CardTitle>

          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </div>

        {isDesktop && (
          <div className="flex-shrink-0 w-[280px]">
            <div className="relative h-32 w-full">
              <Image
                src={heroImage}
                alt={title}
                fill
                className="object-cover rounded-md"
                sizes="(min-width: 768px) 280px, 0px"
                priority={false}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogsCard;
