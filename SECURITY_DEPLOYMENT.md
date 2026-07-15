# Deployment Security Notes (Vercel)

- Store all production secrets only in Vercel Project Environment Variables.
- Never commit `.env*` files (only commit safe placeholders like `.env.example`).
- Rotate any keys immediately if exposure is suspected (DB, auth, API, and token secrets).
- Restrict Vercel GitHub integration to selected repositories only.
