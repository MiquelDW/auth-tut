// Layout Component that wraps around all routes inside route group 'protected'
// it ensures a consistent layout for all routes within the route group 'protected'
// this Layout component will be given to the Root Layout component as a child

import { auth } from "@/auth";
import Navbar from "./_components/Navbar";
import { SessionProvider } from "next-auth/react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  // retrieve the user's data from the session object
  const session = await auth();

  return (
    // wrap route group 'protected' inside a session/context provider
    <SessionProvider session={session}>
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-y-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
};

export default ProtectedLayout;
