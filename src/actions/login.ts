// action.ts module contains server-side logic RPC functions (server actions)
"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // validate the form data again in the backend
  const validatedFields = LoginSchema.safeParse(values);

  // return error object if form data is NOT valid
  if (!validatedFields.success) return { error: "Invalid fields!" };

  // extract validated fields
  const { email, password } = validatedFields.data;

  // search for user in db by given 'email'
  const existingUser = await getUserByEmail(email);

  // return error message if user has not been found by email
  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: "User not found!" };

  // return message if user hasn't verified its email yet
  if (!existingUser.emailVerified) {
    // generate a verification token for the user's email
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );
    // send verification email to the user
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Confirmation email sent!" };
  }

  try {
    // Authenticate user using the defined "credentials" provider with the user's email and password (credentials).
    // Upon successful authentication, the server generates a JWT containing user information (claims) and other things.
    // The JWT is stored in a secure HttpOnly cookie or local storage on the client.
    // The session is now active. The JWT represents the session.
    // For subsequent requests, the client sends the JWT to the server.
    // The server verifies the JWT. If valid, the request is processed, and considers the user authenticated and authorized to access the requested resource.
    // The session ends when the JWT expires or the user logs out
    await signIn("credentials", {
      email,
      password,
      // redirect user to /settings upon success
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        case "AccessDenied":
          return { error: err.type };
        default:
          return { error: "Something went wrong!" };
      }
    }

    // rethrow the error to make sure the user gets redirected (to /settings)
    // ?????????????????????
    throw err;
  }
};
