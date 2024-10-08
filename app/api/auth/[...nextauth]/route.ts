// import NextAuth from 'next-auth'
// import { authConfig } from '@/app/lib/auth'

// const handler =NextAuth(authConfig)

// export {handler as GET ,handler as POST}

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  // Other NextAuth configuration options, if needed
});

console.log({
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret : process.env.GOOGLE_CLIENT_SECRET ?? ""
})
console.log("Next auth accessed succesfully !");
