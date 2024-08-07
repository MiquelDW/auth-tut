"use client";

import { logout } from "@/actions/logout";

const LogoutButton = ({ children }: { children?: React.ReactNode }) => {
  // callback function to handle onClick event
  const onClick = () => {
    logout();
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LogoutButton;
