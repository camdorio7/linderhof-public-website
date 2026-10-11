# Linderhof Country Club — Public Website

Next.js public website with membership, golf policies, amenities, LPOA, news and events, pool/golf passes, and a new club shop. Member sign-in and pass administration link to https://linderhofmembers.com.

## Deploy
1. Upload project contents to GitHub repository `linderhof-public-website`.
2. Import into Vercel as a Next.js project and deploy.
3. Add `linderhofcountryclub.com` when domain access is available.

## Secure shop setup
The catalog is intentionally **not live** until approved merchandise and Stripe prices are configured. The three merchandise entries are starter placeholders, not confirmed inventory.

1. Create and verify a Stripe account owned by the club, with appropriate business authorization.
2. Create approved products and **one-time** Stripe prices; set `STRIPE_PRICE_CAP`, `STRIPE_PRICE_POLO`, `STRIPE_PRICE_GIFT` in Vercel to the corresponding price IDs. Set `STRIPE_SECRET_KEY` as a Vercel secret. Never put it in GitHub or client-side code.
3. Review shipping rates and fulfillment. Currently checkout collects a US shipping address but does **not** charge shipping. Configure shipping rates before launch if required.
4. Review taxes, returns, privacy, terms, and refund policy. Stripe Tax is off by default; only enable `STRIPE_AUTOMATIC_TAX=true` after configuring it in Stripe.
5. Add real merchandise photos, inventory controls, and verified product descriptions.
6. Add a Stripe webhook with signature verification to confirm successful payment and handle fulfillment; **do not fulfill based on the success page**.
7. Test using Stripe test keys/prices, then replace with live keys/prices after club approval.

The checkout route validates a fixed allowlist of product IDs and uses server-side Stripe prices, redirecting to Stripe-hosted Checkout. No card details are processed by this website.

## Development
`npm install` then `npm run dev`. Set environment variables in `.env.local` for local shop testing.

## Before public launch
Replace stock photography, review all policies and membership information with the club, add approved LPOA content, connect a managed news/events feed, and complete the shop fulfillment/payment webhook integration.
