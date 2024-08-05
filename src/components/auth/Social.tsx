"use client";

import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
// import 'signIn' from 'next-auth/react' module if you want to use the function inside a client component
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";

const Social = () => {
  // callback function that handles onClick event
  const onClick = (provider: "google" | "github") => {
    // the client redirects the user to the social login provider (e.g., Google, GitHub) for authentication.
    // the user logs in to the social login provider and grants access.
    // The social login provider redirects the user back to the client with an authorization code.
    // The client exchanges the authorization code for an access token (JWT) from the social login provider.
    // The social login provider returns an access token to the client.
    // The client uses the access token (JWT) to retrieve user information from the social login provider's user info endpoint.
    // The client establishes a session by creating a session ID on the server and storing the corresponding JWT token on the client, typically in a secure HttpOnly cookie.
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>

      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Social;
