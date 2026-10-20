# Linderhof Membership Page Layout Update

Replace `app/membership/page.tsx` in the **Linderhof public website** GitHub repository and redeploy on Vercel.

Changes:
- Removed the full-width “Become a Member” image/text section.
- Moved the existing Membership Options, rates, and Square checkout callout directly below the Membership Inquiry form.
- Kept the official 2027 Membership Guide section, now after the membership options.
- Kept daily amenities packages, policies, and contact section.

No database migrations, new environment variables, or LINDEX changes are required.
The Square checkout URL and membership rate data were not modified.

Verify the Membership page on desktop and mobile after deployment.
