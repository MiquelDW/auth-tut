import type { NextAuthConfig } from "next-auth";
// Credentials Provider allows you to authenticate users using custom logic and credentials
// You define how to verify these credentials, and upon successful authentication, the user is granted a session
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      // define custom authorization logic inside the 'authorize' function, which verifies the user-provided credentials
      // the function activates when a user attempts to sign in with credentials
      authorize: async (credentials) => {
        // validate the form data again in the backend
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          // extract validated fields
          const { email, password } = validatedFields.data;

          // search for user in db
          const user = await getUserByEmail(email);

          // exit function if user doesn't exist or doesn't have a password (users using GitHub or Google don't have a password)
          if (!user || !user.password) return;

          // confirm if user entered the correct password by comparing the given 'password' with the stored password
          const passwordMatch = await bcrypt.compare(password, user.password);

          // return retrieved 'user' if compared passwords match
          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
