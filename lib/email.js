import { Resend } from "resend";
import { welcomeEmail } from "@/lib/emails/welcome";
import { SITE_URL } from "@/lib/site";

export async function sendWelcomeEmail({ to, name }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set: skipping welcome email");
    return { skipped: true };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { subject, html, text } = welcomeEmail({ name, email: to, dashboardUrl: `${SITE_URL}/dashboard` });
  const { data, error } = await resend.emails.send({ from: process.env.EMAIL_FROM, to, subject, html, text });
  if (error) throw new Error(error.message || "Resend error");
  return data;
}
