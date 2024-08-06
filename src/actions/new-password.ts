// action.ts module contains server-side logic RPC functions (server actions)
"use server";

import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string,
) => {
  // display error if token doesn't exist
  if (!token) {
    return { error: "Missing token!" };
  }

  // validate the form data again in the backend
  const validatedFields = NewPasswordSchema.safeParse(values);

  // return error object if form data is NOT valid
  if (!validatedFields.success) return { error: "Invalid password!" };

  // extract validated field
  const { password } = validatedFields.data;
};
