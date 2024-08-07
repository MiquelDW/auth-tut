"use client";

import { FaUser } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import LogoutButton from "./LogoutButton";
import { IoExitOutline } from "react-icons/io5";

const UserButton = () => {
  // retrieve user's data from the current session
  const user = useCurrentUser();

  return (
    // display dropdown menu to the user
    <DropdownMenu>
      {/* button that triggers the dropdown menu */}
      <DropdownMenuTrigger
        // change the default rendered element to the one passed as a child, merging their props and behavior
        asChild
      >
        {/* an image element with a fallback for representing the user */}
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      {/* this component pops out when the dropdown menu is triggered */}
      <DropdownMenuContent>
        <LogoutButton>
          <DropdownMenuContent className="flex items-center">
            <IoExitOutline className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuContent>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
