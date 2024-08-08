import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import server from "../../../../../../libs/mongodb/server";
import User from "../../../../../../models/user";
import bcrypt from "bcrypt";

const options = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await server();
          const user = await User.findOne({ email });

          if (!user) {
            console.log("User not found");
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            console.log("Password does not match");
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error in authorize:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: "https://sync-fewd-11.vercel.app/chat",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: "https://sync-fewd-11.vercel.app/chat",
        },
      },
      scope: "email",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: "https://sync-fewd-11.vercel.app/chat",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    newUser: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signIn callback triggered for provider:", account.provider); // Log provider
      const registerUser = async (data) => {
        try {
          const res = await fetch(`/api/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (res.headers.get("content-type")?.includes("application/json")) {
            const result = await res.json();
            if (res.ok) {
              return true;
            } else {
              console.error("Failed to register user", result);
              return false;
            }
          } else {
            console.error("Unexpected response format");
            return false;
          }
        } catch (error) {
          console.log("Error in registerUser:", error);
          return false;
        }
      };

      if (account.provider === "google") {
        console.log("Google profile:", profile);
        return registerUser({
          email: profile.email,
          displayName: profile.name,
          icon: profile.picture,
        });
      }
      if (account.provider === "facebook") {
        console.log("Facebook profile:", profile);
        const profilePictureData = profile.picture.data; // This should be the object containing the URL
        return registerUser({
          email: profile.email,
          displayName: profile.name,
          icon: profilePictureData.url,
        });
      }
      if (account.provider === "github") {
        console.log("GitHub profile:", profile);
        return registerUser({
          email: profile.email || `${profile.login}@users.noreply.github.com`, // Fallback to a generated email if not provided,
          displayName: profile.name || profile.login,
          icon: profile.avatar_url,
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
};

const handler = (req, res) => {
  console.log("NextAuth handler triggered"); // Log handler trigger
  return NextAuth(req, res, options);
};

export { handler as GET, handler as POST };
