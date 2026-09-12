/**
 * ==============================================================================
 * SHIPFOLD ATELIER — LUXURY EMAIL DISPATCH SERVICE
 * ==============================================================================
 * 
 * Supports:
 *   1. Resend API (via process.env.RESEND_API_KEY) — 3,000 free emails/month.
 *   2. Development Mode / Fallback — outputs OTP directly to server terminal
 *      so patron verification can be tested instantly without third-party setup.
 * ==============================================================================
 */

import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Option 1: Gmail SMTP (Sends to ANY email in the world, 500 emails/day completely free)
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const info = await transporter.sendMail({
        from: `Shipfold Atelier <${gmailUser}>`,
        to,
        subject,
        html,
      });

      console.log(`[EMAIL DISPATCH] Sent to ${to} via Gmail SMTP (ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (gmailErr) {
      console.error('[EMAIL DISPATCH] Gmail SMTP Error:', gmailErr);
      // Fall through to Resend or fallback
    }
  }

  // Option 2: Resend API
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'Shipfold Atelier <onboarding@resend.dev>';

  if (apiKey && !apiKey.includes('placeholder')) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[EMAIL DISPATCH] Sent to ${to} via Resend (ID: ${data.id})`);
        return { success: true, messageId: data.id };
      } else {
        console.error('[EMAIL DISPATCH] Resend API Error:', data);
        return { success: false, error: data.message || 'Failed to send email' };
      }
    } catch (err) {
      console.error('[EMAIL DISPATCH] Network error:', err);
      return { success: false, error: (err as Error).message };
    }
  }

  // Graceful fallback logger for local development / testing
  console.log(`\n======================================================`);
  console.log(`[SHIPFOLD EMAIL SIMULATOR]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`======================================================\n`);
  return { success: true, messageId: `mock_${Date.now()}` };
}

/**
 * Dispatches a bespoke 6-digit email verification OTP
 */
export async function sendVerificationOtpEmail(to: string, name: string, otp: string) {
  const subject = `${otp} is your Shipfold Atelier verification code`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Your Patron Account</title>
</head>
<body style="margin: 0; padding: 40px 10px; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E5E2DC; box-shadow: 0 4px 20px rgba(12, 20, 39, 0.05);">
    <!-- Header -->
    <tr>
      <td style="padding: 36px 40px; background-color: #0C1427; text-align: center;">
        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal; letter-spacing: 0.25em; color: #FFFFFF; text-transform: uppercase;">
          Shipfold
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 9px; letter-spacing: 0.35em; color: #C5A880; text-transform: uppercase;">
          Atelier &amp; Clothiers
        </p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 40px 40px 20px 40px; text-align: left;">
        <span style="font-size: 10px; font-weight: bold; letter-spacing: 0.25em; color: #8B6B38; text-transform: uppercase; display: block; margin-bottom: 8px;">
          Patron Circle Registration
        </span>
        <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 20px; font-weight: normal; color: #111827;">
          Welcome, ${name || 'Esteemed Patron'}.
        </h2>
        <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #4B5563;">
          To confirm your patronage and secure your access to our bespoke curations, please enter this one-time verification code:
        </p>

        <!-- OTP Code Card -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; background-color: #FAF8F5; border: 1px dashed #C5A880;">
          <tr>
            <td style="padding: 24px; text-align: center;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: bold; letter-spacing: 0.35em; color: #0C1427; display: block;">
                ${otp}
              </span>
              <span style="font-size: 11px; letter-spacing: 0.15em; color: #9CA3AF; text-transform: uppercase; display: block; margin-top: 8px;">
                Valid for 10 minutes
              </span>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 1.6; color: #6B7280;">
          If you did not initiate this account creation at Shipfold, please disregard this communique.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px 40px; border-top: 1px solid #F3F4F6; background-color: #FAFAFA; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #9CA3AF; letter-spacing: 0.05em;">
          Shipfold Clothiers &bull; Concierge Hotline: +91 8310246790 &bull; Bengaluru, India
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Dispatches a bespoke 6-digit password reset OTP
 */
export async function sendPasswordResetEmail(to: string, name: string, otp: string) {
  const subject = `${otp} is your Shipfold password reset code`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 40px 10px; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E5E2DC; box-shadow: 0 4px 20px rgba(12, 20, 39, 0.05);">
    <!-- Header -->
    <tr>
      <td style="padding: 36px 40px; background-color: #0C1427; text-align: center;">
        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal; letter-spacing: 0.25em; color: #FFFFFF; text-transform: uppercase;">
          Shipfold
        </h1>
        <p style="margin: 4px 0 0 0; font-size: 9px; letter-spacing: 0.35em; color: #C5A880; text-transform: uppercase;">
          Security &amp; Patron Services
        </p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 40px 40px 20px 40px; text-align: left;">
        <span style="font-size: 10px; font-weight: bold; letter-spacing: 0.25em; color: #B91C1C; text-transform: uppercase; display: block; margin-bottom: 8px;">
          Password Reset Request
        </span>
        <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 20px; font-weight: normal; color: #111827;">
          Dear ${name || 'Patron'},
        </h2>
        <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #4B5563;">
          We received a request to update the password associated with your Shipfold patron account. Use the one-time code below to establish your new credentials:
        </p>

        <!-- OTP Code Card -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; background-color: #FAF8F5; border: 1px dashed #B91C1C;">
          <tr>
            <td style="padding: 24px; text-align: center;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: bold; letter-spacing: 0.35em; color: #0C1427; display: block;">
                ${otp}
              </span>
              <span style="font-size: 11px; letter-spacing: 0.15em; color: #9CA3AF; text-transform: uppercase; display: block; margin-top: 8px;">
                Expires in 10 minutes
              </span>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 1.6; color: #6B7280;">
          If you did not request this password change, your account remains secure; no action is required.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px 40px; border-top: 1px solid #F3F4F6; background-color: #FAFAFA; text-align: center;">
        <p style="margin: 0; font-size: 11px; color: #9CA3AF; letter-spacing: 0.05em;">
          Shipfold Clothiers &bull; Concierge Hotline: +91 8310246790 &bull; Bengaluru, India
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({ to, subject, html });
}
