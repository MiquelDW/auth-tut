// action.ts module contains server-side logic RPC functions
"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // validate the form data again in the backend
  const validatedFields = LoginSchema.safeParse(values);

  // return error object if form data is NOT valid
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  // extract validated fields
  const { email, password } = validatedFields.data;

  try {
    // log user in using the defined "credentials" provider with the provided email and password.
    // upon successfull authorization, 'next-auth' library generates a JSON Web Token (JWT) for the authorized user that's stored in a secure HttpOnly cookie on the client-side (session started), which will be used for subsequent requests.
    // JWT contains information about the user, known as claims, to authenticate and authorize the user in your app (among other things).
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
        default:
          return { error: "Something went wrong!" };
      }
    }

    // rethrow the error to make sure the user gets redirected (to /settings)
    throw err;
  }
};
