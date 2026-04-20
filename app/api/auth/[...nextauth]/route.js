import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
export const runtime = "nodejs";
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectMongo();

        const cookieStore = await cookies();
        const referrer = cookieStore.get("ref")?.value;
        console.log(referrer)

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
           const data = {
      email: user.email,
      name: user.name,
    };

    const mongoose = require("mongoose");

    if (
      referrer &&
      referrer !== "undefined" &&
      referrer !== "null" &&
      mongoose.Types.ObjectId.isValid(referrer)
    ) {
      data.referrer = referrer;
    }

    await User.create(data);
        }

        return true;
      } catch (err) {
        console.error("Error in signIn callback:", err);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
  async redirect({ url, baseUrl }) {
    return baseUrl + "/actions/home";
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
