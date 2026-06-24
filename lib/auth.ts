import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import AzureAD from "next-auth/providers/azure-ad";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Trust the host header — required for Auth.js in production (next start /
  // self-hosting / behind a proxy). On Vercel this is auto, but explicit is safe.
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            organization: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Check if email is verified (required for non-platform admins)
        if (!user.emailVerified && !user.isPlatformAdmin) {
          throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          organizationId: user.organizationId,
          isPlatformAdmin: user.isPlatformAdmin || user.role === "PLATFORM_ADMIN",
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || "common"}/v2.0`,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow credentials provider through (handled in authorize)
      if (account?.provider === "credentials") {
        return true;
      }

      // Handle OAuth sign-in (Google/Microsoft)
      if (account && profile && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
            include: { organization: true },
          });

          if (existingUser) {
            // User exists - update their info and mark email as verified
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                emailVerified: new Date(),
                // Update name if they changed it in their OAuth provider
                firstName: profile.given_name || user.name?.split(" ")[0] || existingUser.firstName,
                lastName: profile.family_name || user.name?.split(" ").slice(1).join(" ") || existingUser.lastName,
              },
            });

            // Store user data for JWT callback
            user.id = existingUser.id;
            user.role = existingUser.role;
            user.organizationId = existingUser.organizationId;
            user.isPlatformAdmin = existingUser.isPlatformAdmin || existingUser.role === "PLATFORM_ADMIN";

            return true;
          }

          // New user - create account with email auto-verified
          const firstName = profile.given_name || user.name?.split(" ")[0] || "User";
          const lastName = profile.family_name || user.name?.split(" ").slice(1).join(" ") || "";

          // Create organization for the new user
          const organization = await prisma.organization.create({
            data: {
              name: `${firstName}'s Organization`,
              email: user.email.toLowerCase(),
              subscriptionTier: "FREE",
              subscriptionStatus: "ACTIVE",
              onboardingCompleted: false,
              onboardingStep: 0,
            },
          });

          // Create the user
          const newUser = await prisma.user.create({
            data: {
              email: user.email.toLowerCase(),
              firstName,
              lastName,
              emailVerified: new Date(), // Auto-verify OAuth users
              role: "ADMIN",
              organizationId: organization.id,
              password: null, // No password for OAuth users
            },
          });

          // Store user data for JWT callback
          user.id = newUser.id;
          user.role = newUser.role;
          user.organizationId = newUser.organizationId;
          user.isPlatformAdmin = false;

          return true;
        } catch (error) {
          console.error("[OAuth Sign In] Error:", error);
          return false;
        }
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.isPlatformAdmin = user.isPlatformAdmin || user.role === "PLATFORM_ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string | null;
        session.user.isPlatformAdmin = token.isPlatformAdmin as boolean;
      }
      return session;
    },
  },
});
