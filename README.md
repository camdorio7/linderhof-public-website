# Linderhof Country Club public website

Next.js 15 public site styled around the supplied Kernwood layout. The official crest is in `public/images/linderhof-crest.png`.

## Local development

```bash
npm install
npm run dev
npm run build
```

## Deploy on Vercel

Connect the repository to Vercel. Configure the following **server-side** environment variables in Vercel → Settings → Environment Variables, then redeploy:

- `RESEND_API_KEY`: API key for your Resend account.
- `INQUIRY_FROM_EMAIL`: a sender on a **verified domain** (for example `Linderhof Country Club <inquiries@linderhofcountryclub.com>` once verified).
- `INQUIRY_TO_EMAIL`: the club inbox receiving inquiries (may be comma-separated).

The membership inquiry form and contact form submit to `/api/inquiry`. They show delivery status and do not claim success unless the email provider accepts the request. Without the variables the forms safely return an unavailable message. Resend API key must never be prefixed with `NEXT_PUBLIC_`.

**Before launch:** Verify sender/domain DNS in Resend, set recipient address, test end-to-end delivery, verify links, replace illustrative Unsplash photography with approved Linderhof photos, and add a club-approved privacy policy and verified golf/LPOA rules. The site does not accept payments. The existing LINDEX member portal handles member logins and passes.

## GitHub update

Remove any old `app/api/checkout/route.ts` or `app/shop` files still in GitHub; uploading a ZIP alone does not delete stale repository files.
