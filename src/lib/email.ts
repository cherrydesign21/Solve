import { Resend } from "resend";
import { MissingConfigError } from "./errors";

let client: Resend | null = null;

function getResendClient(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new MissingConfigError("Missing RESEND_API_KEY. Add it in your Vercel project's Environment Variables.");
    }
    client = new Resend(apiKey);
  }
  return client;
}

const CONTACT_NOTIFICATION_EMAIL = "singhparminder2192@gmail.com";

interface ContactFormEmailInput {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export async function sendContactFormEmail({ firstName, lastName, email, message }: ContactFormEmailInput) {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL || "Solve Contact Form <onboarding@resend.dev>";
  const escapedMessage = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  await resend.emails.send({
    from,
    to: CONTACT_NOTIFICATION_EMAIL,
    replyTo: email,
    subject: `New contact form message from ${firstName} ${lastName}`,
    html: `
      <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; background:#0d0d0d; color:#ffffff; padding:32px; border-radius:12px;">
        <p style="display:inline-block; background:#d9ff00; color:#000; font-weight:600; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; padding:6px 12px; border-radius:999px; margin:0 0 16px;">Contact form</p>
        <h1 style="font-size:20px; margin:0 0 4px;">${firstName} ${lastName}</h1>
        <p style="font-size:14px; color:rgba(255,255,255,0.6); margin:0 0 16px;">${email}</p>
        <p style="font-size:15px; line-height:1.6; white-space:pre-wrap; margin:0;">${escapedMessage}</p>
      </div>
    `,
  });
}

interface BirthdayReminderEmailInput {
  to: string;
  name: string;
  turningAge: number;
}

export async function sendBirthdayReminderEmail({ to, name, turningAge }: BirthdayReminderEmailInput) {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL || "Solve Reminders <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to,
    subject: `Birthday reminder: ${name} in ~4 hours`,
    html: `
      <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; background:#0d0d0d; color:#ffffff; padding:32px; border-radius:12px;">
        <p style="display:inline-block; background:#d9ff00; color:#000; font-weight:600; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; padding:6px 12px; border-radius:999px; margin:0 0 16px;">Birthday reminder</p>
        <h1 style="font-size:22px; margin:0 0 12px;">${name} turns ${turningAge} in about 4 hours!</h1>
        <p style="font-size:14px; color:rgba(255,255,255,0.6); margin:0;">Sent by your Solve birthday reminder.</p>
      </div>
    `,
  });
}
