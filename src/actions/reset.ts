// action.ts module contains server-side logic RPC functions (server actions)
"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  // validate the form data again in the backend
  const validatedFields = ResetSchema.safeParse(values);

  // return error object if form data is NOT valid
  if (!validatedFields.success) return { error: "Invalid email!" };

  // extract validated field
  const { email } = validatedFields.data;

  // search for user in db by given 'email'
  const existingUser = await getUserByEmail(email);

  // return error message if user has not been found by email
  if (!existingUser || !existingUser.email) return { error: "User not found!" };

  // generate a password reset token for the user's email
  const passwordResetToken = await generatePasswordResetToken(
    existingUser.email,
  );
  // send password reset email to the user
  await sendPasswordEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: "Reset email sent!" };
};
