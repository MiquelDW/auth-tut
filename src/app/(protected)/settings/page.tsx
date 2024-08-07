"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const Settings = () => {
  // retrieve user's data from the current session
  const user = useCurrentUser();

  // callback function to handle onClick event
  const onClick = () => {
    logout();
  };

  return (
    <div className="rounded-xl bg-white p-10">
      <button onClick={onClick}>Sign out</button>
    </div>
  );
};

export default Settings;
