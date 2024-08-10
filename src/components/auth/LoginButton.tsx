"use client";

// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import LoginForm from "./LoginForm";

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
    return (
      <Dialog>
        {/* button that triggers the Dialog */}
        <DialogTrigger
          // change the default rendered element to the one passed as a child, merging their props and behavior
          asChild={asChild}
        >
          {children}
        </DialogTrigger>

        {/* this component pops out when the Dialog is triggered  */}
        <DialogContent className="w-auto border-none bg-transparent p-0">
          {/* you can do the same for the registration form */}
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
