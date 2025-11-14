import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type AppUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<AppUser | null> {
        if (!credentials?.email || !credentials.password) return null;

        // 🔍 Cek user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null; // email tidak ditemukan

        // 🔐 Cek password (hashed)
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null; // password salah

        // ⬅️ Return data user
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role ?? "user",
        };
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AppUser).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
