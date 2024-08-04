"use client";

// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";

// predefine object structure for the given 'props' object
interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  // callback function to handle onClick event
  const onClick = () => {
    // redirect user to the login route
    router.push("/auth/login");
  };

  // return this content if given mode === "modal"
  if (mode === "modal") {
    return <span>TODO: Implement modal</span>;
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
