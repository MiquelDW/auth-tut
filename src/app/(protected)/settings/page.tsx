import { auth, signOut } from "@/auth";

const Settings = async () => {
  // retrieve the user's session object (decoded JWT)
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";

          // end user's session on the server side by invalidating the JWT/session token
          // it removes the session cookies stored in the client's browser (JWT is stored in an HttpOnly cookie on the client), effectively logging the user out from the client side as well
          await signOut({ redirectTo: "/auth/login" });
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
};

export default Settings;
