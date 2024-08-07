"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  // do some server stuff before logging user out (clearing stuff, removing user, whatever)

  await signOut({ redirectTo: "/auth/login" });
};
