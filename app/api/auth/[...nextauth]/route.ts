// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import TwitchProvider from "next-auth/providers/twitch";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user?.password) return null;
        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        return valid ? user : null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Update name/image on OAuth sign-in if missing
    async signIn({ user, account, profile }) {
      if (
        account?.provider !== "credentials" &&
        profile?.name &&
        !user.name
      ) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: profile.name,
            image: profile.image ?? undefined,
          },
        });
      }
      return true;
    },

    // Redirect everyone to /dashboard after sign-in
    async redirect() {
      return "/dashboard";
    },
  },

  events: {
    // Merge OAuth-created user into existing credentials user
    async createUser({ user }) {
      if (!user.email) return;

      const existing = await prisma.user.findFirst({
        where: {
          email: user.email,
          id: { not: user.id },
        },
      });

      if (existing) {
        // Copy name/image if missing on the existing profile
        if (!existing.name && user.name) {
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              name: user.name,
              image: user.image ?? undefined,
            },
          });
        }

        // Reassign all Account records to the existing user
        await prisma.account.updateMany({
          where: { userId: user.id },
          data: { userId: existing.id },
        });

        // Delete the duplicate OAuth user
        await prisma.user.delete({ where: { id: user.id } });
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
