import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // In a real app, you would check a database and hash the password.
        // Since we are moving to Vercel, this is better than hardcoding it in the client bundle.
        const adminUser = process.env.ADMIN_USERNAME || 'admin';
        const adminPass = process.env.ADMIN_PASSWORD || 'youssef3mkusA';

        if (credentials?.username === adminUser && credentials?.password === adminPass) {
          return { id: "1", name: "Admin", email: "admin@arama.com" }
        }
        
        return null
      }
    })
  ],
  pages: {
    signIn: '/api/auth/signin', // Can be customized later
  },
  session: {
    strategy: "jwt",
  }
})

export { handler as GET, handler as POST }
