"use client";

import Link from "next/link";
import { Button } from "../ui/button";

// predefine object structure for the given 'props' object
interface BackButtonProps {
  label: string;
  href: string;
}

const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button
      variant="link"
      className="w-full font-normal"
      size="sm"
      // change the default rendered element to the one passed as a child, merging their props and behavior
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;
