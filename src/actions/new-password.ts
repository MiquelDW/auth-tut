// action.ts module contains server-side logic RPC functions (server actions)
"use server";

import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

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

  // search for password reset token in db by given 'token'
  const existingToken = await getPasswordResetTokenByToken(token);
  // return error message if password reset token doesn't exist
  if (!existingToken) return { error: "Token does not exist!" };

  // check if retrieved password reset token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  // return error message if password reset token has expired
  if (hasExpired) return { error: "Token has expired!" };

  // find the user by email that needs a new password
  const existingUser = await getUserByEmail(existingToken.email);
  // return error message if user doesn't exist
  if (!existingUser) return { error: "Email does not exist!" };

  // hash the new password from user
  const hashedPassword = await bcrypt.hash(password, 10);
  // update the retrieved user's password with the new (hashed) password
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  // remove the password reset token from db after user's password has been updated
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated!" };
};
