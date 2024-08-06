// action.ts module contains server-side logic RPC functions (server actions)
"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  // search for verification token in db by given 'token'
  const existingToken = await getVerificationTokenByToken(token);
  // return error message if verification token doesn't exist
  if (!existingToken) return { error: "Token does not exist!" };

  // check if retrieved verification token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  // return error message if verification token has expired
  if (hasExpired) return { error: "Token has expired!" };

  // find the user by email that needs to be validated
  const existingUser = await getUserByEmail(existingToken.email);
  // return error message if user doesn't exist
  if (!existingUser) return { error: "Email does not exist!" };

  // verify the user's email in db if user has passed all checks
  // also update the email field if the user changes its email at some point (if user changes email, that email also needs be verified)
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // remove the verification token from db after user's email has been verified
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!" };
};
