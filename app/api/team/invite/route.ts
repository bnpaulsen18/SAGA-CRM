import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * POST /api/team/invite
 * Send team member invitations
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user?.organizationId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN can invite team members
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can invite team members' },
        { status: 403 }
      );
    }

    const { members } = await req.json();

    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: 'No members provided' },
        { status: 400 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: { name: true },
    });

    // For now, we'll store invitations in a simple way
    // In production, you'd want to:
    // 1. Generate unique invitation tokens
    // 2. Store them in a separate UserInvitation table
    // 3. Send emails with registration links
    // 4. Handle token validation on signup

    const invitations = [];

    for (const member of members) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(member.email)) {
        continue;
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: member.email.toLowerCase() },
      });

      if (existingUser) {
        // User already exists - skip or update their role
        if (existingUser.organizationId === session.user.organizationId) {
          // Already part of this org
          continue;
        }
      }

      // Generate invitation token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const inviteUrl = `${process.env.NEXTAUTH_URL}/signup?invite=${token}`;

      // Send invitation email (if Resend is configured)
      if (resend && process.env.RESEND_FROM_EMAIL) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: member.email,
            subject: `Join ${organization?.name} on SAGA CRM`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #8b5cf6;">You've been invited!</h1>
                <p>You've been invited to join <strong>${organization?.name}</strong> on SAGA CRM as a <strong>${member.role}</strong>.</p>
                <p>Click the link below to accept the invitation and create your account:</p>
                <a href="${inviteUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #8b5cf6, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
                  Accept Invitation
                </a>
                <p style="color: #666; font-size: 14px;">This invitation will expire in 7 days.</p>
                <p style="color: #666; font-size: 14px;">If you didn't expect this invitation, you can safely ignore this email.</p>
              </div>
            `,
          });

          invitations.push({
            email: member.email,
            role: member.role,
            status: 'sent',
          });
        } catch (error) {
          console.error(`Failed to send invitation to ${member.email}:`, error);
          invitations.push({
            email: member.email,
            role: member.role,
            status: 'failed',
          });
        }
      } else {
        // Email not configured - just log the invitation
        console.log(`[Team Invite] Would send invitation to ${member.email} (${member.role})`);
        invitations.push({
          email: member.email,
          role: member.role,
          status: 'email_not_configured',
        });
      }
    }

    return NextResponse.json({
      success: true,
      invitations,
      message: resend
        ? `Sent ${invitations.filter((i) => i.status === 'sent').length} invitations`
        : 'Email service not configured. Invitations logged.',
    });
  } catch (error) {
    console.error('[Team Invite] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send invitations' },
      { status: 500 }
    );
  }
}
