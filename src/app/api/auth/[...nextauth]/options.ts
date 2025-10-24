import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  phone : string
}

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("Credentials are required");
        }

        const res = await fetch(`${backend_url}/api/auth/merchant-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        // if (!res.ok) {
        //   throw new Error("Invalid credentials");
        // }

        
        // resName : user.restaurantName

        

        const user = await res.json();

        if (!res.ok) {
          throw new Error(user.msg || "Invalid credentials");
        }

       
          // sessionStorage.setItem("id" , user.id)
          return {  
            id: user.id,
            name: user.name,
            email: user.email,
            token: user.token,
            is_onb : user.isONB,
            resName : user.resName,
            is_ver : user.isVER,
            // email : user.email,
            address : user.address
            
          };
      
      },
    }),
  ],
   
  pages : {
    signIn : '/login',
    // signOut:'/login'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.email = user.email
        token.name = user.name
        // token.phone = user.phone
        token.is_onb  = user.is_onb
        token.resName = user.resName
        token.is_ver  = user.is_ver
        // token.email = user.email
        token.address = user.address
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.token = token.token;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        // session.user.phone = token.phone as string
        session.user.is_onb = token.is_onb as boolean
        session.user.resName = token.resName as string
        session.user.is_ver = token.is_ver as boolean
        // session.user.email = token.email as string
        session.user.address = token.address as string
      }
      return session;
    },
  },
};
