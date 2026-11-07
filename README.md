# The Execution Log: website setup guide

This is the real website version of The Execution Log. It has:

- a home page and pricing page
- sign-up with email and password, or with Google or Apple
- a confirmation email, a welcome email and password reset emails
- log in, log out, and an automatic log out after 10 minutes with no activity
- three monthly plans through Stripe, Basic (£12.99), Pro (£24.99) and Elite (£39.99), each with a 7-day free trial
- your full journal at `/dashboard`, with every trade saved to your own database

It's built with **Next.js** (the website), **Supabase** (logins and the database), **Stripe** (payments) and **Resend** (emails). It's hosted on **Vercel**.

Do the steps in order. The whole setup takes roughly 2–3 hours the first time. You don't need to write any code: everything is copying, pasting and clicking.

---

## 0. What you need

| Service | What it's for | Cost |
|---|---|---|
| A domain, e.g. from Namecheap or Cloudflare | Your web address | about £10 a year |
| [GitHub](https://github.com) | Stores the code | Free |
| [Vercel](https://vercel.com) | Runs the website | Hobby is free but **doesn't allow commercial sites**. Use Pro (about $20 a month) once you take payments. |
| [Supabase](https://supabase.com) | Logins and database | The free plan is fine to start. Pro is about $25 a month and stops the project pausing. |
| [Stripe](https://stripe.com) | Subscriptions | A small fee per payment, nothing monthly |
| [Resend](https://resend.com) | Sends the emails | Free for up to 3,000 emails a month |
| Google Cloud | "Continue with Google" | Free |
| Apple Developer | "Continue with Apple" (optional) | $99 a year. You can launch without it and add it later. |

Check the current prices on each site; they change.

Throughout this guide, **`yourdomain.com`** means your real domain.

---

## 1. Put the code on GitHub

1. Create a GitHub account and click **New repository**. Name it `the-execution-log` and make it **Private**.
2. On the new repository page, click **uploading an existing file**.
3. Unzip this project and drag **everything inside the folder** into the upload area. Upload the files, not the folder itself.
4. Click **Commit changes**.

---

## 2. Supabase: database and logins

1. Go to supabase.com → **New project**.
   - Name: `the-execution-log`.
   - Database password: generate one and save it somewhere safe.
   - Region: **West EU (London)**.
2. When the project is ready, go to **SQL Editor** → **New query**. Open `supabase/schema.sql`, copy all of it, paste it in and click **Run**. You should see "Success". This creates the tables, the security rules and the screenshot storage.
3. Go to **Authentication → Sign In / Providers → Email**:
   - **Confirm email** must be ON.
   - Set the minimum password length to **8**.
4. Go to **Authentication → URL Configuration**:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: add `https://yourdomain.com/**` and `http://localhost:3000/**`
5. Go to **Authentication → Emails → Templates**:
   - **Confirm signup**: subject `Confirm your email`. Click the source/HTML view, delete what's there and paste in all of `supabase/templates/confirm-signup.html`.
   - **Reset password**: subject `Reset your password`, then paste in `supabase/templates/reset-password.html`.
6. Go to **Project Settings → API** and copy these three values for step 5:
   - Project URL
   - `anon` `public` key
   - `service_role` key. **This one is secret. Never share it or post it.**

---

## 3. Resend: emails

1. Go to resend.com → **Domains → Add domain** and enter `yourdomain.com`.
2. Resend shows some DNS records. Add each one at your domain provider, under DNS settings. Wait until Resend shows the domain as **Verified**. This can take from a few minutes to a few hours.
3. Go to **API Keys → Create API key** with sending access, and copy it.
4. Make Supabase send its emails through Resend. Supabase's built-in sender only allows a few emails an hour, so this step is needed.
   1. In Supabase, go to **Authentication → Emails → SMTP Settings → Enable custom SMTP**.
   2. Fill in these settings:
      - Host: `smtp.resend.com`
      - Port: `465`
      - Username: `resend`
      - Password: your Resend API key
      - Sender email: `hello@yourdomain.com`
      - Sender name: `The Execution Log`

The **welcome email** is sent by the website itself through Resend. It goes out the first time someone confirms their email, or the first time they sign in with Google or Apple.

---

## 4. Stripe: subscriptions

Start in **Test mode** (the toggle at the top of the Stripe dashboard). You'll switch to live at the end.

1. Go to **Product catalogue → Add product** and create three products, each with one price set to **GBP, Recurring, Monthly**:
   - `The Execution Log Basic`: **£12.99**
   - `The Execution Log Pro`: **£24.99**
   - `The Execution Log Elite`: **£39.99**
2. Open each price and copy its **price ID** (starts with `price_`). You'll have three: Basic, Pro and Elite.
3. Go to **Settings → Billing → Customer portal** and turn on:
   - Customers can cancel subscriptions
   - Customers can switch plans. Add all three products, so people can upgrade or downgrade.
   - Customers can update payment methods
   - Invoice history

   Then click **Save**. This is the page people see when they press "Manage billing".
4. Go to **Developers → API keys** and copy the **Secret key** (`sk_test_...`).

You'll set up the webhook in step 6, after the site is online.

---

## 5. Vercel: put the site online

1. Go to vercel.com, sign in with GitHub, click **Add New → Project** and import `the-execution-log`.
2. Before clicking Deploy, open **Environment Variables** and add each of these:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` (no slash at the end) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PRICE_BASIC` | the Basic `price_...` ID |
| `STRIPE_PRICE_PRO` | the Pro `price_...` ID |
| `STRIPE_PRICE_ELITE` | the Elite `price_...` ID |
| `STRIPE_WEBHOOK_SECRET` | leave as `pending` for now; it's set in step 6 |
| `TRIAL_DAYS` | `7` (or `0` for no trial) |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | `The Execution Log <hello@yourdomain.com>` |
| `ANTHROPIC_API_KEY` | Anthropic API key (AI coach, step 8b) |

3. Click **Deploy**.
4. Go to **Settings → Domains**, add `yourdomain.com` and follow Vercel's DNS instructions.

If the deploy fails, copy the red error text from the build log and send it to Claude.

---

## 6. Stripe webhook: so the site knows who has paid

1. In Stripe, go to **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.paused`
   - `customer.subscription.resumed`
4. Save, then click **Reveal** under Signing secret and copy it (`whsec_...`).
5. In Vercel, go to **Settings → Environment Variables** and set `STRIPE_WEBHOOK_SECRET` to that value. Then go to **Deployments → ⋯ → Redeploy**.

---

## 7. Google sign-in

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a new project.
2. Go to **APIs & Services → OAuth consent screen** and set it up:
   - User type: External
   - App name: The Execution Log
   - Support email: yours
   - Home page: `https://yourdomain.com`
   - Privacy policy: `https://yourdomain.com/privacy`
   - Terms: `https://yourdomain.com/terms`
3. Go to **Credentials → Create credentials → OAuth client ID** and fill in:
   - Type: **Web application**
   - Authorised redirect URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`

   Supabase shows this exact address on its Google provider page.
4. Copy the **Client ID** and **Client secret**.
5. In Supabase, go to **Authentication → Sign In / Providers → Google**, turn it on, paste both values and save.
6. Back in Google, **publish** the consent screen so anyone can sign in, not just test users.

## 8. Apple sign-in (optional, $99 a year)

This needs an Apple Developer account. Follow Supabase's guide: **Authentication → Sign In / Providers → Apple**. It links to the exact steps. In short:

1. Create a **Services ID**.
2. Add `yourdomain.com` and the Supabase callback URL to it.
3. Create a **Sign in with Apple key**, which downloads a `.p8` file.
4. Paste the details into Supabase.

The secret Apple gives you expires every 6 months, so set a reminder to renew it.

Until Apple is set up, the "Continue with Apple" button shows a friendly "isn't available right now" message.

---

## 8b. AI Trading Coach (Elite)

1. Go to [console.anthropic.com](https://console.anthropic.com), add billing and create an **API key**.
2. In Vercel, add `ANTHROPIC_API_KEY` (and optionally `AI_DAILY_LIMIT`, which defaults to 30 coach requests per Elite user per day). Then redeploy.

Each review costs a few pence, paid from your Anthropic account. The daily limit protects you from runaway costs.

## 9. Test everything (still in Stripe test mode)

1. Open `https://yourdomain.com` and click **Start your journal**.
2. Sign up with your email. You should get the **Confirm your email** email.
3. Click the link. You should land on the pricing page and get the **Welcome** email.
4. Pick a plan. On the Stripe page, use the test card `4242 4242 4242 4242`, any future date and any 3 digits.
5. You should arrive in your journal and see the trading profile and first-account steps.
6. Check that logging trades, screenshots, the calendar and exports all work.
7. Go to **Settings → Subscription & billing → Manage billing**. Stripe's portal should open.
8. **Log out**, then log back in.
9. Press **Forgot password?** and check the reset email arrives and works.
10. Leave the dashboard alone for 10 minutes. You should be logged out.
11. Try **Continue with Google**.

## 10. Go live

1. In Stripe, switch off Test mode and set up the live versions of everything:
   - create the three products and prices again
   - set up the customer portal again
   - add the webhook again, pointing at the same URL
2. In Vercel, replace these with their live values:
   - `STRIPE_SECRET_KEY` (`sk_live_...`)
   - `STRIPE_PRICE_BASIC`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_ELITE`
   - `STRIPE_WEBHOOK_SECRET`
3. Redeploy.
4. Fill in the **[brackets]** in `app/privacy/page.js` and `app/terms/page.js` (your name or company, address and email). Have them checked before launch, because they're templates, not legal advice.

---

## Plans and "Coming soon" features

Plans, prices and the feature lists live in `lib/plans.js`. Each feature is marked live (`L`) or coming soon (`S`). When a feature is built, change its `S` to `L` and the "Coming soon" tag disappears from the pricing page.

Basic is limited to 2 trading accounts. Pro and Elite are unlimited.

## Running it on your own computer (optional)

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # open http://localhost:3000
```

## How it fits together

| File | What it does |
|---|---|
| `app/page.js` | Home page |
| `app/pricing/page.js` | Pricing page |
| `app/signup` | Sign-up page |
| `app/login` | Log-in page |
| `app/forgot` | Forgotten password page |
| `app/reset-password` | Choose a new password |
| `app/check-email` | "Check your email" page |
| `app/auth/confirm` | Where email links land: confirms the account and sends the welcome email |
| `app/auth/callback` | Where Google and Apple sign-in come back |
| `app/dashboard` | Checks you're logged in and subscribed, then opens the journal |
| `public/journal.html` | The journal itself, the same one as the Claude version |
| `lib/host.js` | Connects the journal to Supabase: trades, settings, screenshots and downloads |
| `app/api/checkout` | Starts a Stripe subscription |
| `app/api/billing-portal` | Opens Stripe's "manage billing" page |
| `app/api/stripe/webhook` | Stripe tells the site when someone pays, cancels or their card fails |
| `app/api/blob/[id]` | Serves trade screenshots to their owner only |
| `supabase/schema.sql` | Database tables, security rules and storage |
| `lib/emails/welcome.js` | The welcome email |

**Security notes**

- Every table has row-level security, so a user can only ever read or change their own rows and screenshots.
- Payment status is only written by the Stripe webhook, which is checked with Stripe's signature. Users can't fake it.
- The dashboard checks the login and subscription on the server before it loads.
