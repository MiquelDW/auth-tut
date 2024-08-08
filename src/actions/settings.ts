// action.ts module contains server-side logic RPC functions (server actions)
"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  // retrieve the user's data from the session object
  const user = await currentUser();

  // return error if user is not logged in
  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  // search for logged-in user in db by given 'id'
  const existingUser = await getUserById(user.id);

  // return error message if logged-in user has not been found
  if (!existingUser) return { error: "Unauthorized" };

  // update the data of the retrieved user in db with the given 'values'
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Settings Updated!" };
};
