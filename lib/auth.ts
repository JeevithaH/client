import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './db';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'aviveky_luxury_secret_super_secure_key_2026',
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'patron@aviveky.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        const userWithPassword = await getUserByEmail(credentials.email);
        if (!userWithPassword) {
          throw new Error('No patron account found with this email');
        }

        if (userWithPassword.status === 'banned') {
          throw new Error('This account has been restricted by administration');
        }

        const isValid = bcrypt.compareSync(credentials.password, userWithPassword.password_hash);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: userWithPassword.id,
          name: userWithPassword.name,
          email: userWithPassword.email,
          role: userWithPassword.role || 'customer',
          status: userWithPassword.status || 'active',
          image: userWithPassword.avatar || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role?: string }).role || 'customer';
        token.status = (user as unknown as { status?: string }).status || 'active';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as unknown as { id?: string }).id = token.id as string;
        (session.user as unknown as { role?: string }).role = (token.role as string) || 'customer';
        (session.user as unknown as { status?: string }).status = (token.status as string) || 'active';
      }
      return session;
    },
  },
};
