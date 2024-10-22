import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any, req): Promise<any>{
        // Add logic here to look up the user from the credentials supplied
        await dbConnect();
        try {

           const user =await UserModel.findOne({
            $or:
              [
                {email: credentials.indentifier},
                {username: credentials.indentifier}
              ]
            }
          )

          if(!user){
            throw Error("User Not found")
          }
          if(!user.isVerified){
            throw Error("Please Verify email before login")
          }

          const isPasswordCorrect =  await bcrypt.compare(credentials.password, user.password)

          if(isPasswordCorrect){
            return user
          }else{
            throw Error("Invalid Password")
          }
        } catch (err: any) {
          throw new Error(err)
        }

        
      }
    })
  ],
  callbacks:{
    async jwt({token,user}){
      if(user){
        token._id = user._id?.toString()
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username
      }
      return token
    },
    async session({session,token}){
    
      if(token){
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username
      }
      return session;
    }
  },
  pages:{
    signIn:"/sign-in"
  },
  session:{
    strategy:"jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}

