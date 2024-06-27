import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/libs/prisma";
import { verify } from "argon2";

export const authOptions: NextAuthOptions = {
  // Configura uno o más proveedores de autenticación
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, req) => {
        // Aquí puedes agregar tu lógica de autenticación
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) throw new Error('Email o contraseña son incorrectos');

        if (
          user &&
          credentials?.password &&
          !(await verify(user.password, credentials.password))
        ) {
          throw new Error('Email o contraseña son incorrectos');
        } else {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role, // Asegúrate de que el rol se incluya aquí
          };
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
    signOut: '/',
  },
  callbacks: {
    async session({ session, token }) {
      // Agrega el rol del usuario a la sesión
      if (token?.user?.role && session.user) {
        session.user.role = token.user.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Agrega el rol del usuario al token JWT
      if (user) {
        token.user = {
          id: user.id,
          role: user.role,
        };
      }
      return token;
    },
  },
};

const handle = NextAuth({
  ...authOptions,
});

export { handle as GET, handle as POST };