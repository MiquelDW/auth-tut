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

          // remove the session cookies stored in the client's browser (JWT is stored in an HttpOnly cookie on the client), effectively ending the session and logging the user out
          await signOut({ redirectTo: "/auth/login" });
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
};

export default Settings;
