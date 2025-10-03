import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs"; // для проверки паролей
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        console.log("👉 credentials:", credentials);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("👉 user from DB:", user);

        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);
        console.log("👉 password valid:", isValid);

        if (!isValid) return null;

        console.log("👉 roles compare:", user.role, "vs", credentials.role);
        if (user.role !== credentials.role) return null;

        console.log("✅ Auth success:", {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
