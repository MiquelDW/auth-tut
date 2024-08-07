// retrieve the user's session inside client components (from session provider)
// sign the user out inside client components
import { useSession, signOut } from "next-auth/react";

export const useCurrentUser = () => {
  // retrieve the user's session object (decoded JWT)
  const session = useSession();

  // return user's data from the session object
  return session.data?.user;
};
