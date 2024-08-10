// action.ts module contains server-side logic RPC functions (server actions)
"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import { error } from "console";

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

  // if user is logged in with a OAuth Account, undefine given form fields
  if (existingUser.isOAuth) {
    // these are fields that OAuth users cannot modify
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // only send verification email if the user changed its email
  if (values.email && values.email !== user.email) {
    const existingUserByEmail = await getUserByEmail(values.email);

    // return an error if the user tries to change its email to an email that already exists in the db
    // but don't return error if the user keeps the same email
    if (existingUserByEmail && existingUserByEmail.id !== existingUser.id) {
      return { error: "Email already in use!" };
    }

    // generate verification token for the user's new email
    const verificationToken = await generateVerificationToken(values.email);
    // send verification email to the user's new email
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Verification email sent!" };
  }

  // change the current password of the user
  if (values.password && values.newPassword && existingUser.password) {
    // check if the user entered correct password
    const passwordsMatch = await bcrypt.compare(
      values.password,
      existingUser.password,
    );

    // return error if given password doesn't match the user's password in db
    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }

    // hash new password that will replace the users current password
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  // update the data of the retrieved user in db with the given 'values'
  const updatedUser = await db.user.update({
    where: { id: existingUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Settings Updated!", updatedUser };
};
