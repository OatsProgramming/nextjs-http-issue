import type { NextAuthOptions } from 'next-auth'
import Google from 'next-auth/providers/google'
import Github from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prismadb from '@/lib/prismadb'
import NextAuth from 'next-auth/next'

export const authOptions: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                name: {
                    name: 'name',
                    label: 'name',
                    type: 'text',
                    placeholder: 'Jack O.'
                },
                email: {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'jackoatmeals@gmail.com'
                },
                password: {
                    name: 'password',
                    label: 'password',
                    type: 'password'
                }
            },
            authorize: async (credentials) => {
                return null
            }
        })
    ],
    adapter: PrismaAdapter(prismadb),
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id
                }
            }
        },
        jwt: ({ user, token }) => {
            if (user) {
                return {
                    ...token,
                    id: user.id
                }
            }
            return token
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
