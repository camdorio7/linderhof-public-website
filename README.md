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


## October 2026 photo and pre-domain update
- Actual Linderhof photos now replace stock imagery on key pages.
- Inquiry forms are intentionally paused until the domain and verified sender are ready; no submissions are accepted or silently discarded.
- Removed unused Resend inquiry API. No Resend environment variables are needed for this version.
- Membership, Golf, Pool & Amenities, Events, LPOA, Contact, Passes and Member Sign In routes remain available.
- For existing GitHub deployments, **delete old `app/api/inquiry/route.ts` and `app/api/checkout/route.ts`** if still present; uploading a ZIP does not delete existing files.
- News/events and LPOA content require club-approved updates before public launch.


## 2027 guide and social feeds
- Full guide: `/public/2027-membership-guide.pdf`, linked from Membership.
- Facebook: Set `NEXT_PUBLIC_FACEBOOK_PAGE_URL` to the official public Facebook Page URL in Vercel; the public Page Plugin timeline will render if Facebook allows the page to be embedded. Some browsers block third-party embeds.
- Instagram: Set `NEXT_PUBLIC_INSTAGRAM_URL` to the club's official Instagram profile URL. A live Instagram post grid requires Meta-approved access or a compliant third-party provider; the site currently offers a direct profile link.
- No Resend configuration is needed yet. Inquiry forms remain disabled until email delivery is configured.
- The low-resolution entrance photo is no longer used as a full-screen hero. Original Linderhof drone images are used instead.
