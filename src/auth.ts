import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: {
      /** The user's role within the application */
      role: UserRole;
      /** Status of the user's 2FA */
      isTwoFactorEnabled: boolean;
      /** Checks if user signed in with OAuth account */
      isOAuth: boolean;

      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt";
import { getAccountByUserId } from "./data/account";
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user's role */
    role: UserRole;
    /** Status of the user's 2FA */
    isTwoFactorEnabled: boolean;
    /** Checks if user signed in with OAuth account */
    isOAuth: boolean;
  }
}

// initialize NextAuth.js using JSON Web Token (JWT) strategy for session management
// prisma manages the user data and other session-related information
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    // event handler triggers when user used an OAuth provider to log in
    async linkAccount({ user }) {
      // update user entry from db where its 'id' matches the given 'user.id'
      await db.user.update({
        where: { id: user.id },
        // populate the email verified field (you don't need to verify emails coming from trusted OAuth providers)
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    // controls whether a user is allowed to sign in or not
    async signIn({ user, account }) {
      // allow OAuth accounts without email verification
      if (account?.provider !== "credentials") return true;

      // stop sign-flow and redirect user to error page if its 'id' doesn't exist
      if (!user.id) {
        return false;
      }

      // search for user in db by given 'user.id'
      const existingUser = await getUserById(user.id);
      // display error if user does not exist in db or if user's email isn't verified
      if (!existingUser || !existingUser.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        // prevent signin and display error if user didn't complete 2FA
        if (!twoFactorConfirmation) return false;

        // delete two-factor confirmation for next sign in
        // personal choice, you don't have to do this. You can also just add an 'expires' field in the 'TwoFactorConfirmation' table
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      // allow user to login
      return true;
    },
    // invoke callback when JWT is created or updated, the returned token will be forwarded to the session callback
    async jwt({ token }) {
      // return token if user is logged out
      if (!token.sub) return token;

      // retrieve user from db by the given user id (token.sub)
      const existingUser = await getUserById(token.sub);
      // return token if user does not exist in db
      if (!existingUser) return token;

      // retrieve the user's Account from db by the given user id (token.sub)
      const existingAccount = await getAccountByUserId(token.sub);
      // return token if user's Account does not exist in db
      if (!existingAccount) return token;

      // assign the user information fields again with the data of the retrieved user in case its data has been updated in the db and the session data needs to reflect those changes
      token.name = existingUser.name;
      token.email = existingUser.email;
      // also, expand the JWT with the role & 2FA status of the retrieved user
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.isOAuth = !!existingAccount;

      console.log(existingUser.role);

      // return the JWT
      return token;
    },
    // invoke callback whenever you request session data (e.g. with Auth())
    async session({ session, token }) {
      // retrieve the JWT's 'id' and store it in the user object from the session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // retrieve the JWT's 'role' and store it in the user object from the session
      if (token.role && session.user) {
        session.user.role = token.role;
      }

      // retrieve the JWT's 'isTwoFactorEnabled' and store it in the user object from the session
      if (token.role && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }

      // retrieve the JWT's 'name' and store it in the user object from the session
      if (token.name && session.user && token.email) {
        session.user.name = token.name;
      }

      // retrieve the JWT's 'email' and store it in the user object from the session
      if (token.email && session.user) {
        session.user.email = token.email;
      }

      // retrieve the JWT's 'isTwoFactorEnabled' and store it in the user object from the session
      if (token.isOAuth && session.user) {
        session.user.isOAuth = token.isOAuth;
      }

      // return the session data
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
