// retrieve the user's session inside client components (from session provider)
// sign the user out inside client components
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  // Client and server components rely on the same underlying principles for handling session data, but client components rely on the '/api/auth/session' endpoint to fetch session data and update the client state, its suitable for interactive user interfaces in React components.
  // Server components directly retrieve and verify the session cookie (JWT) within the server environment. It doesn't involve making an HTTP request since it has direct access to the request and response objects.
  // check 'lib/auth.ts' to read more about the underlying principles.

  // retrieve session data that's returned as an object
  const session = useSession();

  // only return user data from the session object
  return session.data?.user;
};
