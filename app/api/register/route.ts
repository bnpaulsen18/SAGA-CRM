import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken, sendVerificationEmail } from "@/lib/auth-email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      organizationName,
      ein,
      organizationEmail,
      organizationPhone,
    } = body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !organizationName ||
      !ein ||
      !organizationEmail
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Check if organization with this EIN already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { ein },
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization with this EIN already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Generate email verification token
    const verificationToken = generateToken();
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24); // 24 hour expiry

    // Create organization and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          ein,
          email: organizationEmail,
          phone: organizationPhone || null,
        },
      });

      // Create user (first user is always an admin)
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: "ADMIN",
          organizationId: organization.id,
          emailVerificationToken: verificationToken,
          emailVerificationExpiry: verificationExpiry,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          organizationId: true,
        },
      });

      return { user, organization };
    });

    // Send verification email (don't block registration if email fails)
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (error) {
      console.error('[Registration] Failed to send verification email:', error);
      // Continue anyway - user can request a new verification email later
    }

    return NextResponse.json(
      {
        message: "Registration successful. Please check your email to verify your account.",
        user: result.user,
        emailSent: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
