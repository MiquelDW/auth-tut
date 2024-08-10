// action.ts module contains server-side logic RPC functions (server actions)
"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  // validate the form data again in the backend
  const validatedFields = LoginSchema.safeParse(values);

  // return error object if form data is NOT valid
  if (!validatedFields.success) return { error: "Invalid fields!" };

  // extract validated fields
  const { email, password, code } = validatedFields.data;

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

  // check if user 2FA'd if its enabled
  if (existingUser.isTwoFactorEnabled) {
    if (code) {
      // search for two-factor token of user
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) return { error: "Invalid email!" };

      // return an error if given 'code' doesn't match the code send to the user (code that's been retrieved from db)
      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      // check if the retrieved code has expired
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) return { error: "Code expired!" };

      // remove two-factor token from db after user passed every check
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      // check if user has an existing two-factor auth confirmation
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );
      // remove two-factor auth confirmation from db after if user already has it
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      // create new two-factor auth confirmation if user doesn't already have one
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      // generate a six digit two-factor token for the user's email
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      // send two-factor email to the user
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

      // return object to the front-end indicating to display inputs so that the user can enter the 2FA code
      return { twoFactor: true };
    }
  }

  try {
    // Authenticate user using the defined "credentials" provider. The server verifies the user's credentials against stored user data in db.
    // Upon successful authentication/login procedure, the server generates a JWT containing a Header, Payload and the Signature which are necessary to extract the claims from the Payload (claims consists of info about the user and session for applications to understand the session data and make authentication and authorization decisions).
    // The JWT is stored in a secure HttpOnly cookie. This type of cookie is not accessible via JavaScript, which helps mitigate the risk of XSS attacks.
    // When the user makes subsequent requests to the server, the browser includes the HttpOnly cookie containing the JWT.
    // The server verifies the JWT to ensure it's valid. If valid, the server extracts the claims from the Payload.
    // The server uses the session data (claims) to authenticate and authorize the user for the requested action.
    // The session ends when the JWT expires or when the user logs out.
    await signIn("credentials", {
      email,
      password,
      // redirect user to /settings upon success
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
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
