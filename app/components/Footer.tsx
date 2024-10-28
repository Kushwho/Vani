"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/#about-us", label: "About Us" },
  { href: "/#features", label: "Features" },
  { href: "/blogs", label: "Blog" },
];

const contactLinks = [
  {
    href: "mailto:aryan@vanii.ai",
    label: "Email",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    href: "https://www.linkedin.com/company/vanii-ai",
    label: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary-50 w-full ">
      <div className=" mx-auto py-16 px-4 md:px-6 flex justify-around gap-6">
        {/* Logo and Tagline */}
        <div className="flex items-center max-md:flex-col gap-6">
          <div className="flex-shrink-0">
            <Image
              src="/images/icons/logo.png"
              alt="Logo"
              width={32} // Since h-8 is 32px
              height={32} // Maintaining aspect ratio
              priority // Since it's a logo above the fold
              className="w-auto h-8 object-contain"
            />
          </div>
          <p className="whitespace-nowrap font-medium">
            Achieve Fluency
            <br /> with Vanii Today!
          </p>
        </div>

        {/* Contact Section */}
        <div className=" flex max-md:flex-col items-center justify-center gap-3">
          <h3 className="text-lg md:text-xl font-medium text-primary-700">
            We&apos;d Like &<br className=" md:inline" /> Love to Help
          </h3>
          <div className="flex flex-col max-md:flex-row flex-wrap ">
            {contactLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:text-primary-700"
                asChild
              >
                <Link href={link.href}>
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:block ">
          <ul className="space-y-1 max-md:flex items-center justify-center">
            {navigationLinks.map((link) => (
              <li key={link.label}>
                <Button
                  variant="ghost"
                  className="w-fit hover:text-primary-700 transition-colors "
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
