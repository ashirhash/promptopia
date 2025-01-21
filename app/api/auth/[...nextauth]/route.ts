import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ConnectToDB } from "@utils/database";
import User from "@models/user";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session }: any) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ profile }: any) {
      try {
        await ConnectToDB();

        const userExists = await User.findOne({
          email: profile.email,
        }).catch((err) => {
          console.error("Error in finding user: ", err.message);
          throw new Error("Database query failed");
        });

        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          }).catch((err) => {
            console.error("Error creating new user: ", err.message);
            throw new Error("User creation failed");
          });
        }

        return true;
      } catch (error: any) {
        console.error("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };