import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCollection } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSignUp: { label: "Is Sign Up", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const users = await getCollection("users");
        const user = await users.findOne({ email: credentials.email });

        if (credentials.isSignUp) {
          // Sign up
          if (user) {
            throw new Error("User already exists");
          }

          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const result = await users.insertOne({
            email: credentials.email,
            password: hashedPassword,
            createdAt: new Date(),
          });

          return {
            id: result.insertedId.toString(),
            email: credentials.email,
            name: credentials.email.split("@")[0],
          };
        } else {
          // Sign in
          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.email.split("@")[0],
          };
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
