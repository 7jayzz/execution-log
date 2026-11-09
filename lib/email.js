import { Resend } from "resend";
import { welcomeEmail } from "@/lib/emails/welcome";
import { SITE_URL } from "@/lib/site";
import { LEGAL } from "@/lib/legal";

// Sends one email through Resend. Does nothing (and says so in the logs) until RESEND_API_KEY and EMAIL_FROM are set.
export async function sendEmail({ to, subject, html, text }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.warn(`Email not sent (Resend not configured): ${subject}`);
    return { skipped: true };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({ from: process.env.EMAIL_FROM, to, subject, html, text, reply_to: LEGAL.email });
  if (error) throw new Error(error.message || "Resend error");
  return data;
}

export async function sendWelcomeEmail({ to, name }) {
  return sendEmail({ to, ...welcomeEmail({ name, email: to, dashboardUrl: `${SITE_URL}/dashboard` }) });
}
