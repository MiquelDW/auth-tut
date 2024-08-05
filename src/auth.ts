import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: UserRole;
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
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user's role. */
    role: UserRole;
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

      // search for user in db
      const existingUser = await getUserById(user.id);
      // display error if user does not exist in db or if user's email isn't verified
      if (!existingUser || !existingUser.emailVerified) return false;

      // TODO: Add 2FA check

      return true;
    },
    // invoke callback when JWT is created or updated, the returned token will be forwarded to the session callback
    async jwt({ token }) {
      // return token if user is logged out
      if (!token.sub) return token;

      // check if user already exists in db
      const existingUser = await getUserById(token.sub);
      // return token if user does not exist in db
      if (!existingUser) return token;

      // expand the JWT with the role of the retrieved user from db
      token.role = existingUser.role;

      return token;
    },
    // invoke callback whenever you retrieve current session (e.g. with Auth())
    async session({ session, token }) {
      // retrieve the JSON Web Token's (JWT) 'id' and store it in the session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      // retrieve the JSON Web Token's (JWT) 'role' and store it in the session
      if (token.sub && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
