import { auth } from "@/auth";

export const currentUser = async () => {
  // For this process to work, the user has to be authenticated (logged in) - If the user is not authenticated, there will be no JWT stored in the HttpOnly cookie, and auth() will indicate that no session is available

  /* 1. Retrieve the Session Cookie:
  The server extracts the JWT stored in the HttpOnly cookie sent with the request. This JWT serves as a session token, which consists of a Header, Payload & Signature that consists of data that are necessary to extract the claims from the Payload (claims consists of info about the user and session for applications to understand the session data and make authentication and authorization decisions). */
  /* 2. Verify the JWT:
  The JWT is verified to ensure its validity. This involves checking the signature and the expiration date of the token. If the token is invalid or expired, the session retrieval fails, and auth() returns null. */
  /* 3. Decode the JWT:
  If the JWT is valid, it is decoded to extract the claims within the Payload. */
  /* 4. Return the Session Object:
  The extracted session data (claims) is returned as a JavaScript object. This object includes user information (e.g., user ID, email, roles) and any other relevant session details. */

  // retrieve session data that's returned as an object
  const session = await auth();

  // only return user data from the session object
  return session?.user;
};

export const currentRole = async () => {
  // retrieve the user's data from the session object
  const user = await currentUser();

  // only return the user's role from the user object
  return user?.role;
};
