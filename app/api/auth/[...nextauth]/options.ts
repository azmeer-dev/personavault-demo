import type { NextAuthOptions } from "next-auth";

export const options: NextAuthOptions = {
  providers: [],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: null, // Will disable the new account creation screen if set to null
  },
};
