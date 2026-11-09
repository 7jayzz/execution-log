# Email templates

## Supabase sign-in emails (paste into Supabase)
Supabase dashboard → Authentication → Emails → Templates.

| Template in Supabase | File | Subject |
|---|---|---|
| Confirm signup | `confirm-signup.html` | Confirm your email for The Execution Log |
| Reset password | `reset-password.html` | Reset your The Execution Log password |

These are sent by Supabase itself. Once the domain is bought, set Supabase → Authentication → Emails → SMTP Settings to use Resend so they come from your own address and aren't limited to a few an hour.

## Emails the website sends (via Resend, in `lib/emails/`)
| Email | When | File |
|---|---|---|
| Welcome | First sign-in after confirming email | `welcome.js` |
| Trial ending | 3 days before a free trial ends (Stripe `customer.subscription.trial_will_end`) | `billing.js` |
| Payment failed | A renewal or first payment fails (Stripe `invoice.payment_failed`) | `billing.js` |
| Plan cancelled | Someone cancels in the billing portal | `billing.js` |

They only send once `RESEND_API_KEY` and `EMAIL_FROM` (e.g. `The Execution Log <hello@theexecutionlog.com>`) are set in Vercel. Replies go to `NEXT_PUBLIC_SUPPORT_EMAIL`.
