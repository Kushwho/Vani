import {
  PortableTextComponentProps,
  PortableTextMarkComponentProps,
  PortableTextReactComponents,
} from "@portabletext/react";
import { urlFor } from "@/lib/sanity-client";
import Image from "next/image";

interface ImageProps {
  asset: {
    _ref: string;
  };
  alt?: string;
}

interface CallToActionProps {
  text: string;
  url: string;
}

interface LinkProps {
  href: string;
  _type: string;
}

export const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }: PortableTextComponentProps<ImageProps>) => (
      <Image 
        src={urlFor(value.asset._ref).url()} 
        alt={value.alt || ""} 
        width={800}
        height={600}
        className="w-full h-auto"
      />
    ),
    callToAction: ({
      value,
      isInline,
    }: PortableTextComponentProps<CallToActionProps>) =>
      isInline ? (
        <a href={value.url}>{value.text}</a>
      ) : (
        <div className="callToAction">{value.text}</div>
      ),
  },

  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<LinkProps>) => {
      const rel = !value?.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a href={value?.href} rel={rel}>
          {children}
        </a>
      );
    },
  },
};
