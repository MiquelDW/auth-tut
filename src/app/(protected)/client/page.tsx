"use client";

import UserInfo from "@/components/UserInfo";
import { useCurrentUser } from "@/hooks/use-current-user";

const Client = () => {
  // retrieve the user's data from the session object
  const user = useCurrentUser();

  // pass down user's information retrieved from the custom hook
  return <UserInfo user={user} label="📲 Client component" />;
};

export default Client;
