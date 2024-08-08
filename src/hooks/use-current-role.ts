import { useCurrentUser } from "./use-current-user";

export const useCurrentRole = () => {
  // retrieve the user's data from the session object
  const user = useCurrentUser();

  // only return the user's role from the user object
  return user?.role;
};
