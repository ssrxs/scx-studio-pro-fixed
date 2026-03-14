import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// SADECE Edge Runtime uyumlu ayarlar (Prisma yok!)
const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isStudio = nextUrl.pathname.startsWith("/studio");
      if (isStudio) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
