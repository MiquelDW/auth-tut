"use client";

import UserButton from "@/components/auth/UserButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  // retrieve current pathname
  const pathname = usePathname();

  return (
    <nav className="flex w-[600px] items-center justify-between rounded-xl bg-secondary p-4 shadow-sm">
      <div className="flex gap-x-2">
        <Button
          // change the default rendered element to the one passed as a child, merging their props and behavior
          asChild
          // button variant depends on the current pathname
          variant={pathname === "/client" ? "default" : "outline"}
        >
          <Link href="/client">Client</Link>
        </Button>

        <Button
          // change the default rendered element to the one passed as a child, merging their props and behavior
          asChild
          // button variant depends on the current pathname
          variant={pathname === "/server" ? "default" : "outline"}
        >
          <Link href="/server">Server</Link>
        </Button>

        <Button
          // change the default rendered element to the one passed as a child, merging their props and behavior
          asChild
          // button variant depends on the current pathname
          variant={pathname === "/admin" ? "default" : "outline"}
        >
          <Link href="/admin">Admin</Link>
        </Button>

        <Button
          // change the default rendered element to the one passed as a child, merging their props and behavior
          asChild
          // button variant depends on the current pathname
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};

export default Navbar;
